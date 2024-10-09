import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Dashboard, GraphWidget, MathExpression, GraphWidgetView} from "aws-cdk-lib/aws-cloudwatch";
import {Duration} from "aws-cdk-lib";

export class MetricStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      // Prod
      const messagesMetric = new MathExpression({
          label: "",
          expression: "SEARCH('{Messages,Author} MetricName=MessageCount', 'Sum', 86400)"
      });

      const forwardMetric = new MathExpression({
          label: "",
          expression: "SEARCH('{ForwardChannel,ChannelName} MetricName=ForwardCount', 'Sum', 2592000)"
      });

      const langMetric = new MathExpression({
          label: "",
          expression: "SEARCH('{Language,LanguageName} MetricName=LanguageCount', 'Sum', 86400)"
      });

      const reactionMetric = new MathExpression({
          label: "",
          expression: "SEARCH('{Messages,ReactionAuthor} MetricName=ReactionCount', 'Sum', 86400)"
      });

    new Dashboard(this, "MessagesDashboard", {
      dashboardName: "MessagesDashboard",
      defaultInterval: Duration.days(7),
    }).addWidgets(
        new GraphWidget({
            title: "Messages count",
            width: 12,
            period: Duration.days(1),
            statistic: 'Sum',
            left: [messagesMetric]
        }),
        new GraphWidget({
            title: "Language rate",
            width: 12,
            period: Duration.days(1),
            statistic: 'Sum',
            left: [langMetric]
        }),
        new GraphWidget({
            title: "Message Reactions count",
            width: 12,
            period: Duration.days(1),
            statistic: 'Sum',
            left: [reactionMetric]
        }),
        new GraphWidget({
            title: "Forward count",
            width: 24,
            period: Duration.days(30),
            statistic: 'Sum',
            view: GraphWidgetView.BAR,
            left: [forwardMetric]
        })
    );
  }
}
