---
title: "Kubernetes Troubleshooting"
date: 2018-11-07T15:24:42+01:00
weight: 10
---

This page have the intent to help the developers access and perform any type of maintenance in the Production Mattermost Kubernetes Cluster which is running on AWS using the EKS.


## Setup local environment to access K8s

First if you don't have `kubectl` installed you will need to install, also if your `kubectl` is older then version 1.10 you need to update.

Also you will need the AWS Keys for the Main Mattermost AWS account. You can get one using Onelogin, please follow this [instructions](../../onelogin-aws)

Steps:

- run `onelogin-aws-login` in the command line, it will ask your username, password and the two-factor auth.
- select `arn:aws:iam::521493210219:role/OneLoginPowerUsers`
- export the environment variable `AWS_PROFILE` which will be something like `521493210219/OneLoginPowerUsers/YOUR_EMAIL`

### To install kubectl

Follow the instructions in this [page](https://kubernetes.io/docs/tasks/tools/install-kubectl/)

### Configure kubectl for Amazon EKS

Follow the instructions in this [page](https://docs.aws.amazon.com/eks/latest/userguide/configure-kubectl.html)

### Create a kubeconfig for Amazon EKS

Cluster Name: `mattermost-prod-k8s`

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
