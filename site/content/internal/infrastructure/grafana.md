---
title: "Community Grafana"
date: 2020-04-01T16:08:19+02:00
subsection: internal
weight: 20
---

## Community Grafana

The Grafana application is used to visualise the performance metrics of the community installations. The application runs in the Mattermost Cloud infrastructure in the same cluster that community installations are hosted.

Grafana URL: https://grafana.mattermost.com

After the migration to the cloud infrastructure the community installations are created by the cloud provisioner. Therefore, the naming has changed and another type of Prometheus label is required to select which installation you want to get data for.

## How to create and use the variable that enables selection between installations

To get the different versions of installations in a simple variable, a variable of type query needs to be created with a query value of **label_values(v1alpha1_mattermost_com_installation)**. Then in each of the Grafana panels that is required a selection between installations, the following filter should be applied in the query **{v1alpha1_mattermost_com_installation=~"$mattermost"}** where *mattermost* is the name of the variable created. An example of a query can be seen below:

```
sum(irate(mattermost_post_total{v1alpha1_mattermost_com_installation=~"$mattermost"}[5m]))
```

Before the migration to the cloud infrastucture and because the community installations were manually created it was possible to specify the name of the installations to be like *community-daily*, *community-release* or *community*. After the migration, because the **community-daily** is managed by the cloud provisioner it needs to have a unique name, which in our case is **mm-swbn**. Therefore, users in the dropdown list of their community server variable will see the options **community**, **community-release** and **mm-swbn**, which is the community-daily.

For any questions please contact the [cloud team](https://community-daily.mattermost.com/private-core/channels/cloud-team)
