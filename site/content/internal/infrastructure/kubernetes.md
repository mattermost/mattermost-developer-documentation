---
title: "Community Mattermost running on Kubernetes"
date: 2018-11-06T12:36:58+01:00
subsection: internal
---

# Community Mattermost running on Kubernetes

The objective of this page is to describe the process to move our Mattermost server ([community.mattermost.com](https://community.mattermost.com)) running on AWS using EC2 machines to Kubernetes.

## Setup Kubernetes Cluster (K8s cluster, ingress and cert manager)

Here you can decide how and where you will deploy your K8s cluster. You can choose: AWS, Azure, GCP, your own Datacenter, baremetal...
There are K8s services that host the master and etcd for you and you just need to take care the nodes, like AWS EKS, Azure, GCP

After you deploy you K8s cluster you will need to setup some Ingress, We choose for now the [NGINX Ingress](https://github.com/kubernetes/ingress-nginx)

 - We installed using this [documentation](https://kubernetes.github.io/ingress-nginx/deploy/#aws)
 - We need to add the cache and set the Keep-alive in order to reduce the WebSocket errors

So the ConfigMap will be similar to this one

```YAML
kind: ConfigMap
apiVersion: v1
metadata:
  name: nginx-configuration
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
data:
  use-proxy-protocol: "true"
  http-snippet: "proxy_cache_path /cache/mattermost levels=1:2 keys_zone=mattermost_cache:10m max_size=3g inactive=120m use_temp_path=off;"
  keep-alive: "3600"
```

The Service will be similar to this:

```YAML
kind: Service
apiVersion: v1
metadata:
  name: ingress-nginx
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: "*"
    service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout: "3600"
spec:
  type: LoadBalancer
  selector:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
  ports:
    - name: http
      port: 80
      targetPort: http
    - name: https
      port: 443
      targetPort: https
```

We also need to add in the deployment a volume to store the cache. Then add in the deployment manifest the following items

```YAML
...
      volumeMounts:
      - mountPath: /cache/mattermost
        name: mattermost-cache
...
      volumes:
      - emptyDir: {}
        name: mattermost-cache
...
```


But you can install using [Helm](https://www.helm.sh/) which make it more easy to install. Please follow [this](https://github.com/helm/helm) to install Helm in your local environment and in the K8s cluster.

The NGINX Helm chart you can check [here](https://github.com/helm/charts/tree/master/stable/nginx-ingress)

```Bash
$ kubectl create ns ingress
$ helm install --namespace ingress --name nginx-ingress stable/nginx-ingress
```

For the Cert manager we installed using the helm chart [cert manager](https://github.com/helm/charts/tree/master/stable/cert-manager), please follow the instructions [here](https://cert-manager.readthedocs.io/en/latest/getting-started/) for more information

## Setup Database

You can configure a database in Kubernetes by yourself or use the one included in the Mattermost Helm chart or even use AWS RDS (or others).
For the migration of `community.mattermost.com` to Kubernetes we decide for now to use the existing database we have in AWS RDS.

So the configuration changes here, was basically the security groups to allow the Kubernetes cluster talk to the database.

## Setup Mattermost

To setup the Mattermost enterprise edition you will need to setup a Stateful Set in order to have multiple volume claims for your pods when you scale.

Our Stateful Set manifest, this is only valid if you use the Enterprise Edition which supports HA. If you use the Team Edition you can install with Helm (the official Mattermost Helm chart you can found [here](https://github.com/helm/charts/tree/master/stable/mattermost-team-edition))

```YAML
apiVersion: apps/v1beta1
kind: StatefulSet
metadata:
  name: mattermost-community-daily
  labels:
    app: mattermost-community-daily
spec:
  updateStrategy:
    type: RollingUpdate
  serviceName: mattermost-community-daily-app
  replicas: 2
  selector:
    matchLabels:
      app: mattermost-community-daily
  template:
    metadata:
      labels:
        app: mattermost-community-daily
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8067"
        prometheus.io/path: "/metrics"
    spec:
      initContainers:
      - name: init-config
        image: busybox
        imagePullPolicy: IfNotPresent
        command:
          - sh
          - "-c"
          - |
            set -ex
            rm -rfv /mattermost/config/lost+found
            cp /tmp/config/config.json /mattermost/config/config.json
            chown -R 2000:2000 /mattermost/config
        volumeMounts:
        - mountPath: /tmp/config/config.json
          name: mattermost-init-config-json
          subPath: config.json
        - mountPath: /mattermost/config/
          name: mattermost-config
      - name: init-plugins-config
        image: busybox
        imagePullPolicy: IfNotPresent
        command:
          - sh
          - "-c"
          - |
            cp /mnt/plugins/init-plugins.sh /tmp && cd /tmp && chmod +x init-plugins.sh
            ls -la
            ./init-plugins.sh
            ls -la /mattermost/plugins
        volumeMounts:
        - name: mattermost-init-plugins
          mountPath: /mnt/plugins/
        - name: mattermost-plugins
          mountPath: /mattermost/plugins/
        - name: mattermost-plugins-client
          mountPath: /mattermost/client/plugins/
      - name: remove-lost-found-set-permissions
        image: busybox
        imagePullPolicy: IfNotPresent
        command:
        - sh
        - "-c"
        - |
          set -ex
          rm -rfv /mattermost/plugins/lost+found
          rm -rfv /mattermost/client/plugins/lost+found
          chown -R 2000:2000 /mattermost/plugins/
          chown -R 2000:2000 /mattermost/client/plugins/
        volumeMounts:
        - mountPath: /mattermost/plugins/
          name: mattermost-plugins
        - mountPath: /mattermost/client/plugins/
          name: mattermost-plugins-client
      containers:
      - name: mattermost-community-daily
        image: "mattermost/mattermost-enterprise-edition:5.4.0"
        imagePullPolicy: Always
        ports:
        - containerPort: 8000
          name: api
        - containerPort: 8067
          name: metrics
        - containerPort: 8075
          name: cluster
        - containerPort: 8074
          name: gossip
        livenessProbe:
          initialDelaySeconds: 90
          timeoutSeconds: 5
          periodSeconds: 15
          httpGet:
            path: /api/v4/system/ping
            port: 8000
        readinessProbe:
          initialDelaySeconds: 15
          timeoutSeconds: 5
          periodSeconds: 15
          httpGet:
            path: /api/v4/system/ping
            port: 8000
        volumeMounts:
        - mountPath: /mattermost/plugins/
          name: mattermost-plugins
        - mountPath: /mattermost/client/plugins/
          name: mattermost-plugins-client
        - mountPath: /mattermost/config/
          name: mattermost-config
        resources:
          {}
      volumes:
      - name: mattermost-init-config-json
        configMap:
          name: mattermost-community-daily-init-config-json
          items:
          - key: config.json
            path: config.json
      - name: mattermost-init-plugins
        configMap:
          name: mattermost-community-daily-init-plugins
  volumeClaimTemplates:
  - metadata:
      name: mattermost-plugins
      annotations:
    spec:
      accessModes:
      - "ReadWriteOnce"
      resources:
        requests:
          storage: "10Gi"
  - metadata:
      name: mattermost-plugins-client
      annotations:
    spec:
      accessModes:
      - "ReadWriteOnce"
      resources:
        requests:
          storage: "10Gi"
  - metadata:
      name: mattermost-config
      annotations:
    spec:
      accessModes:
      - "ReadWriteOnce"
      resources:
        requests:
          storage: "1Gi"
```

JobServer Deployment:

```YAML
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: mattermost-community-daily-jobserver
  labels:
    app: mattermost-community-daily-jobserver
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: mattermost-community-daily-jobserver
        component: "jobserver"
    spec:
      initContainers:
      - name: "init-mattermost-app"
        image: "appropriate/curl:latest"
        imagePullPolicy: "IfNotPresent"
        command: ["sh", "-c", "until curl --max-time 5 http://mattermost-community.community:8000/api/v4/system/ping ; do echo waiting for Mattermost App come up; sleep 5; done; echo init-mattermost-app finished"]
      containers:
      - name: mattermost-community-daily-jobserver
        image: "mattermost/mattermost-enterprise-edition:5.4.0"
        imagePullPolicy: Always
        command: ["mattermost", "jobserver"]
        volumeMounts:
        - mountPath: /mattermost/config/config.json
          name: config-json
          subPath: config.json
      volumes:
      - name: config-json
        configMap:
          name: mattermost-community-daily-init-config-json
          items:
          - key: config.json
            path: config.json
```

The Services manifests:

```YAML
apiVersion: v1
kind: Service
metadata:
  name: mattermost-community-daily
  labels:
    app: mattermost-community-daily
spec:
  selector:
    app: mattermost-community-daily
  type: ClusterIP
  ports:
  - port: 8000
    targetPort: 8000
    protocol: TCP
    name: mattermost-community-daily
  - port: 8067
    targetPort: 8067
    protocol: TCP
    name: mattermost-community-daily-app-metrics
```

Configmap that holds the Mattermost config will be customized as your needs:

```YAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: mattermost-community-daily-init-config-json
  labels:
    app: mattermost-community-daily
data:
  config.json: |
    {
        "ServiceSettings": {
            ....
        }
        ...
    }
```

We add a initContainer to setup the plugins, as you can see in the Stateful Set above, here is the confimap that holds the plugin definition and the script that download and setup the plugins.

```YAML
apiVersion: v1
kind: ConfigMap
metadata:
  name: mattermost-community-daily-init-plugins
  labels:
    app: mattermost-community-daily
data:
  init-plugins.sh: |
    #!/bin/sh
    PLUGINS_TAR="hovercardexample.tar.gz"
    PLUGINS_TAR="${PLUGINS_TAR} jira2.tar.gz"
    PLUGINS_TAR="${PLUGINS_TAR} memes.tar.gz"
    PLUGINS_TAR="${PLUGINS_TAR} mattermost-github-plugin-linux-amd64.tar.gz"
    PLUGINS_TAR="${PLUGINS_TAR} mattermost-plugin-autolink-linux-amd64.tar.gz"
    PLUGINS_TAR="${PLUGINS_TAR} mattermost-zoom-plugin-linux-amd64.tar.gz"
    PLUGINS_TAR="${PLUGINS_TAR} mattermost-jira-plugin-linux-amd64.tar.gz"
    PLUGINS_TAR="${PLUGINS_TAR} mattermost-plugin-autotranslate-linux-amd64.tar.gz"
    PLUGINS_TAR="${PLUGINS_TAR} com.github.matterpoll.matterpoll.tar.gz"
    PLUGINS_TAR="${PLUGINS_TAR} com.mattermost.welcomebot.tar.gz"

    for plugin_tar in ${PLUGINS_TAR};
    do
      wget http://mattermost-public-plugins-kubernetes.s3-website-us-east-1.amazonaws.com/${plugin_tar} -P /mattermost/plugins
      cd /mattermost/plugins
      tar -xzvf ${plugin_tar}
      rm -f ${plugin_tar}
    done
```

## Other Deployments

We also installed Prometheus and Grafana for monitoring the cluster and the Mattermost instance.
Both you can install with Helm.

## Limitations

  - For any changes in the `config.json` you need to update the configmap and kill the pods
  - Same applies to the plugins. If you need to add a new plugin you need to update the confimap and restart the pods
