---
title: "Kubernetes Troubleshooting"
date: 2018-11-07T15:24:42+01:00
weight: 10
---

This page helps developers access and perform any type of maintenance in the Production Mattermost Kubernetes Cluster, which is running on AWS using EKS.

## Set up a local environment to access Kubernetes (K8s)

1. Make sure you have `kubectl` version 1.10 or later installed. If not, follow [these instructions](https://kubernetes.io/docs/tasks/tools/install-kubectl/).

2. Use your OneLogin account to retrieve AWS Keys for the main Mattermost AWS account following [these instructions](../../onelogin-aws)

NOTE: When using Onelogin-aws account for Kubernetes configuration, please select the main Mattermost AWS account.

### Configure kubectl for Amazon EKS

Follow [these instructions](https://docs.aws.amazon.com/eks/latest/userguide/configure-kubectl.html)

### Create a kubeconfig for Amazon EKS

Cluster Name: `mattermost-prod-k8s`

Follow [these instructions](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html)

Follow the instructions in this [page](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html)


### Check if you can see the pods

To check if you can see the pods in the K8s cluster, you can check doing this:

```Bash
$ kubectl get po -n community
NAME                                              READY   STATUS    RESTARTS   AGE
mattermost-community-0                            1/1     Running   0          5h
mattermost-community-1                            1/1     Running   0          23h
mattermost-community-jobserver-65985bfc47-88qq9   1/1     Running   0          5h
```

# Troubleshooting

#### Namespaces

We are using two namespaces to deploy Mattermost

    - `community` namespace holds the Mattermost deployment which uses the Release Branch or a stable release and the ingress is pointing to `https://community.mattermost.com` and `https://pre-release.mattermost.com`
    - `community-daily` namespace holds the Mattermost deployment which uses the master branch and the ingress is pointing to `https://community-daily.mattermost.com`

### Check if the PODS are running

To check if the pods are running in both namespaces you can run the following command:

```Bash
$ kubectl get po -n community
NAME                                              READY   STATUS    RESTARTS   AGE
mattermost-community-0                            1/1     Running   0          5h
mattermost-community-1                            1/1     Running   0          23h
mattermost-community-jobserver-65985bfc47-88qq9   1/1     Running   0          5h

$ kubectl get po -n community-daily
NAME                                                    READY   STATUS    RESTARTS   AGE
mattermost-community-daily-0                            1/1     Running   0          3h
mattermost-community-daily-1                            1/1     Running   0          3h
mattermost-community-daily-jobserver-78f7cbf756-wls4f   1/1     Running   0          2h
```

If one or more pods show the status != `Running` you can use the describe and logs to check what is wrong

Describe the pod:

```Bash
$ kubectl describe pods ${POD_NAME} -n ${NAMESPACE}
```

Get the Pod logs:

```Bash
$ kubectl logs pods ${POD_NAME} -n ${NAMESPACE}
```
