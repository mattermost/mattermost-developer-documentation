---
title: "Testing MM on k8s"
date: 2018-06-25T13:31:26+02:00
subsection: internal
---

We are testing Mattermost in Kubernetes, we have our helm charts for [Enterprise Edition](https://github.com/mattermost/mattermost-kubernetes/) and for Team Edition.

Currently we have one Kubernetes cluster running on Azure and this document will describe how our internal QA and Devs can access the cluster and Mattermost for config and CLI tests.

Wee have one Mattermost installation running in this cluster. This instance is public accessible and can be accessed with this url:

https://ci-k8s-mysql.azure.k8s.mattermost.com

To access the Pods for CLI tests, please follow the steps below:

1. Have an Azure account (Please contact DevOPS team)
2. Install the Azure Cli
    * For Mac:
        ```Bash
        $ brew install az
        ```

3. Install `kubectl` to run commands in Kubernetes:
    * you can install following this [instruction](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
    * or you can use the az-cli to install:
        ```Bash
        $ az aks install-cli
        ```

4. Login in the Azure cloud
```Bash
$ az login
```

5. Download the configuration to access the k8s cluster (aks kubeconfig)
```Bash
$ az aks get-credentials --name mm-test-helm --resource-group mm-test-helm-k8s
```

6. Test if you can see the pods running in the cluster:
```Bash
$ kubectl get pods --namespace ci-k8s-mysql
NAME                                                     READY     STATUS    RESTARTS   AGE
mm-k8s-mysql-mattermost-app-7b565d9d85-7wwsb             1/1       Running   2          3d
mm-k8s-mysql-mattermost-app-7b565d9d85-glg2k             1/1       Running   0          3d
mm-k8s-mysql-mattermost-app-jobserver-7455cc9bdc-tl9bn   1/1       Running   0          3d
mm-k8s-mysql-minio-5ff8fcd8dc-qhzpm                      1/1       Running   0          3d
mm-k8s-mysql-mysqlha-0                                   2/2       Running   0          3d
mm-k8s-mysql-mysqlha-1                                   2/2       Running   0          3d
```

7. To access the Mattermost server get one of the two `mm-k8s-mysql-mattermost-app` pods. In the example above you can pick the `mm-k8s-mysql-mattermost-app-7b565d9d85-glg2k`. Then run the following command:
```Bash
$ kubectl exec -it mm-k8s-mysql-mattermost-app-7b565d9d85-glg2k --namespace ci-k8s-mysql -- /bin/bash
```

8. Perform your tests.

NOTE:
* Please remember that any configuration changes made will be lost when the pod is replaced, this can happen when we upgrade the server or at any time when Kubernetes understand that needs a restart.
* If you need to perform a configuration change you need to change the confimap that holds the configuration and kill all mattermost running pods to get new pods with new configuration

Change the configmap to apply configuration changes:

1. Get the confimap:
```Bash
$ kubectl get configmap --namespace ci-k8s-mysql
NAME                                      DATA      AGE
mm-k8s-mysql-mattermost-app-config-json   1         3d
mm-k8s-mysql-mattermost-app-tests         1         3d
mm-k8s-mysql-minio                        1         3d
mm-k8s-mysql-mysqlha                      4         3d
```

In our case the confimap is: `mm-k8s-mysql-mattermost-app-config-json`
Edit that:
```Bash
$ kubectl edit configmap mm-k8s-mysql-mattermost-app-config-json --namespace ci-k8s-mysql
```

Make the changes you need, save and exit the editor
To kill and get new pods, do the following:

```Bash
$ kubectl get pods --namespace ci-k8s-mysql -l "app=mm-k8s-mysql-mattermost-app"
NAME                                           READY     STATUS    RESTARTS   AGE
mm-k8s-mysql-mattermost-app-7b565d9d85-7wwsb   1/1       Running   2          3d
mm-k8s-mysql-mattermost-app-7b565d9d85-glg2k   1/1       Running   0          3d

$ kubectl delete pods --namespace ci-k8s-mysql mm-k8s-mysql-mattermost-app-7b565d9d85-7wwsb mm-k8s-mysql-mattermost-app-7b565d9d85-glg2k
```

For the jobserver:
```Bash
$ kubectl get pods --namespace ci-k8s-mysql -l "app=mm-k8s-mysql-mattermost-app-jobserver"
NAME                                                     READY     STATUS    RESTARTS   AGE
mm-k8s-mysql-mattermost-app-jobserver-7455cc9bdc-tl9bn   1/1       Running   0          3d

$ kubectl delete pods --namespace ci-k8s-mysql mm-k8s-mysql-mattermost-app-jobserver-7455cc9bdc-tl9bn
```

After a few seconds you should have new pods running.