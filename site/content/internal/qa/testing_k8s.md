---
title: "Testing Mattermost on Kubernetes"
date: 2018-06-25T13:31:26+02:00
subsection: internal
---

We have helm charts for [Enterprise Edition](https://github.com/mattermost/mattermost-kubernetes/) and Team Edition to test Mattermost in Kubernetes (k8s).

Currently we have one k8s cluster running on Azure. This document describes how our internal QA and Devs can access the cluster for config.json and CLI tests. The cluster has one Mattermost server running, which is public accessible at https://ci-k8s-mysql.azure.k8s.mattermost.com.

To access the k8s pods for CLI tests, please follow these steps:

1. If you don't have an Azure account, contact the Dev Ops team to create one.

2. Install the Azure CLI
    * For Mac:
        ```Bash
        $ brew install az
        ```

3. Install `kubectl` to run commands in k8s. You can follow [these instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/), or use the following Azure CLI:

```Bash
$ az aks install-cli
```

4. Log in to the Azure cloud:

```Bash
$ az login
```

5. Download the configuration file to access the k8s cluster:

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

7. To access the Mattermost server, find one of the two running `mm-k8s-mysql-mattermost-app` pods. In the example above you can pick the `mm-k8s-mysql-mattermost-app-7b565d9d85-glg2k` pod and run the following command:

```Bash
$ kubectl exec -it mm-k8s-mysql-mattermost-app-7b565d9d85-glg2k --namespace ci-k8s-mysql -- /bin/bash
```

8. Perform your tests.

NOTE:
* Please remember that any configuration changes you make are lost when the pod is replaced. This happens when the server is upgraded or restarted.
* To apply a configuration change, update the k8s configmap and kill all running pods. This creates new pods with the new configuration settings. Follow these steps to apply the configuration changes:

1. Get the configmap:

```Bash
$ kubectl get configmap --namespace ci-k8s-mysql
NAME                                      DATA      AGE
mm-k8s-mysql-mattermost-app-config-json   1         3d
mm-k8s-mysql-mattermost-app-tests         1         3d
mm-k8s-mysql-minio                        1         3d
mm-k8s-mysql-mysqlha                      4         3d
```

2. In our case, the configmap is: `mm-k8s-mysql-mattermost-app-config-json`. Edit it by first running:

```Bash
$ kubectl edit configmap mm-k8s-mysql-mattermost-app-config-json --namespace ci-k8s-mysql
```

3. Then make the changes you need in a text editor and save the file.
4. Kill the existing pods and create new ones:

```Bash
$ kubectl get pods --namespace ci-k8s-mysql -l "app=mm-k8s-mysql-mattermost-app"
NAME                                           READY     STATUS    RESTARTS   AGE
mm-k8s-mysql-mattermost-app-7b565d9d85-7wwsb   1/1       Running   2          3d
mm-k8s-mysql-mattermost-app-7b565d9d85-glg2k   1/1       Running   0          3d

$ kubectl delete pods --namespace ci-k8s-mysql mm-k8s-mysql-mattermost-app-7b565d9d85-7wwsb mm-k8s-mysql-mattermost-app-7b565d9d85-glg2k
```

5. Do the same for the job server:
```Bash
$ kubectl get pods --namespace ci-k8s-mysql -l "app=mm-k8s-mysql-mattermost-app-jobserver"
NAME                                                     READY     STATUS    RESTARTS   AGE
mm-k8s-mysql-mattermost-app-jobserver-7455cc9bdc-tl9bn   1/1       Running   0          3d

$ kubectl delete pods --namespace ci-k8s-mysql mm-k8s-mysql-mattermost-app-jobserver-7455cc9bdc-tl9bn
```

6. After a few seconds you should have new pods running with the updated configuration settings.
