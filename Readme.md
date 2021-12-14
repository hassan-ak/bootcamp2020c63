# bootcamp2020c63 - AWS EventBridge

## EventBridge

### Class Notes

There are two types of apps first is tightly coupled, where one component is so much dependant on the other that we cant change one without changing other, failure to one component will also cause a failure for other components. Other are loosely coupled which are totaly opposite of tightly coupled apps. Loosely coupled apps are knows as event driven architecture and are carried out with event bridge.
Talking about event driven architecture there can be multiple event emitters and multiple event consumers. Connecting them together is a difficult job as each emitter to be connected to each client so what we can do connect all the emitters to an event bus and all clients to that bus too.
Event bus comprises of rules and meta data. Event emitters can be AWS sevices, SaaS partners or apps and targets are AWS services while event busses can be Saas events, App events or AWS sercie events.
Event driven system are asynchronous systems.

### Sections

- [Eventbridge](./step15_eventbridge)

### Reading Material

- [Event Bus cdk construct docs](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-events.EventBus.html)

### Class Videos

- [YouTube English](https://www.youtube.com/watch?v=jrUDwrgBCqg&ab_channel=PanacloudServerlessSaaSTraining)
- [Facebook English](https://www.facebook.com/zeeshanhanif/videos/10225545010436996)
- [YouTube Urdu](https://www.youtube.com/watch?v=1y4REyORf1U&ab_channel=PanacloudServerlessSaaSTraininginUrdu)
- [Facebook Urdu](https://www.facebook.com/zeeshanhanif/videos/10225564742050274)
