import * as mars2d from "mars2d";

import "./theme/widget.scss";

import * as widget from "./widget/widgetManager";
// eslint-disable-next-line no-import-assign
mars2d.widget = widget;

import { BaseWidget } from "./widget/BaseWidget";
mars2d.widget.BaseWidget = BaseWidget;

import { WidgetEventType } from "./widget/WidgetEventType";
mars2d.widget.WidgetEventType = WidgetEventType;
mars2d.widget.EventType = WidgetEventType;

export { widget };
