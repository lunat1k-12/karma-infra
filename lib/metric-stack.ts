import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Dashboard, GraphWidget, MathExpression, Metric} from "aws-cdk-lib/aws-cloudwatch";
import {Duration} from "aws-cdk-lib";

export class MetricStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Local
    const messagesMetricLocal = new MathExpression({
      label: "",
      expression: "SEARCH('{MessagesLocal,Author} MetricName=MessageCount', 'Sum', 300)"
    });

    const forwardMetricLocal = new MathExpression({
      label: "",
      expression: "SEARCH('{ForwardChannelLocal,ChannelName} MetricName=ForwardCount', 'Sum', 300)"
    });

    new Dashboard(this, "LocalMessagesDashboard", {
      dashboardName: "LocalMessagesDashboard",
      defaultInterval: Duration.days(1)
    }).addWidgets(
        new GraphWidget({
            title: "Messages count",
            width: 12,
            left: [messagesMetricLocal]
        }),
        new GraphWidget({
            title: "Forward count",
            width: 12,
            left: [forwardMetricLocal]
        })
    );

    // Prod
    const messagesMetric = new MathExpression({
      label: "",
      expression: "SEARCH('{Messages,Author} MetricName=MessageCount', 'Sum', 300)"
    });

      const forwardMetric = new MathExpression({
          label: "",
          expression: "SEARCH('{ForwardChannel,ChannelName} MetricName=ForwardCount', 'Sum', 300)"
      });

    new Dashboard(this, "MessagesDashboard", {
      dashboardName: "MessagesDashboard",
      defaultInterval: Duration.days(1)
    }).addWidgets(
        new GraphWidget({
            title: "Messages count",
            width: 12,
            left: [messagesMetric]
        }),
        new GraphWidget({
            title: "Forward count",
            width: 12,
            left: [forwardMetric]
        })
    );
  }
}
