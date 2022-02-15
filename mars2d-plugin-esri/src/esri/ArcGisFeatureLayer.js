import L from "leaflet";
import * as LEsri from "esri-leaflet";
import * as mars2d from "mars2d";

/**
 * @typedef {Object} ArcGisFeatureLayer.EventType
 * 当前类支持的{@link EventType}事件类型（包括自定义字符串事件名）
 *
 * @property {String} loading 当新功能开始加载时触发。
 * @property {String} load	 当地图当前边界中的所有要素都已加载时触发。
 *
 * @property {String} createfeature	 首次加载要素图层中的要素时触发
 * @property {String} removefeature	 当图层上的要素从地图中移除时触发
 * @property {String} addfeature	 当先前删除的要素添加回地图时触发
 *
 * @property {String} click 当用户单击（or taps）地图时触发
 * @property {String} dblclick	 当用户双击（or double-taps）地图时触发
 * @property {String} mousedown 当用户在图层上按下鼠标按钮时触发
 * @property {String} mouseover 当鼠标进入图层时触发
 * @property {String} mouseout 当鼠标离开图层时触发
 * @property {String} popupopen 当绑定到当前图层的Popup弹窗打开时触发
 * @property {String} popupclose 当绑定到当前图层的Popup弹窗关闭时触发
 *
 * @property {String} requeststart	 当对服务的请求开始时触发。
 * @property {String} requestend	 当对服务的请求结束时触发。
 * @property {String} requestsuccess	 当对服务的请求成功时触发。
 * @property {String} requesterror	 当对服务的请求响应错误时触发。
 * @property {String} authenticationrequired	 当对服务的请求失败并需要身份验证时，这将被触发。
 *
 *
 * @example
 * //绑定监听事件
tileLayer.on('load', function (event) {
  console.log('触发了事件',event)
});
 * @see BaseClass#on
 * @see BaseClass#off
 */

/**
 * ArcGIS Server WFS矢量服务图层，
 * 【需要引入mars2d-esri 插件库】
 *
 * @param {Object} options 参数对象，包括以下：
 * @param {String} options.url ArcGIS Server服务地址,如：https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer
 * @param {String} [options.where] 用于过滤服务器端的特性的可选表达式。字符串值应该用单引号表示，即:"FIELDNAME = '字段值'";可以找到有关有效SQL语法的更多信息。
 *
 * @param {Number} [options.minZoom] 图层将显示在地图上的最远缩放级别。
 * @param {Number} [options.maxZoom] 图层将显示在地图上的最近缩放级别。
 * @param {String} [options.token] 如果您在服务需要传递令牌，它将包含在对服务的所有请求中。
 * @param {String} [options.proxy]  代理服务URL
 * @param {Boolean} [options.useCors=true] 如果此服务在发出 GET 请求时应使用 CORS。
 * @param {Function} [options.onEachFeature] 	提供了一个机会来内省图层中的各个 GeoJSON 功能。
 *
 * @param {String|Number} [options.id = uuid()] 图层id标识
 * @param {String|Number} [options.pid = -1] 图层父级的id，一般图层管理中使用
 * @param {String} [options.name = ''] 图层名称
 * @export
 * @class ArcGisFeatureLayer
 * @extends {L.esri.FeatureLayer}
 * @see [支持的事件类型]{@link ArcGisFeatureLayer.EventType}
 * @see [更多请参考L.esri.FeatureLayer类API]{@link http://esri.github.io/esri-leaflet/api-reference/layers/feature-layer.html}
 */
export class ArcGisFeatureLayer extends LEsri.FeatureLayer {
  /**
   *  内置唯一标识ID
   *
   * @type {String}
   * @readonly
   */
  get uuid() {
    return this._leaflet_id;
  }

  /**
   * 是否已添加到地图
   *
   * @type {Boolean}
   * @readonly
   *
   */
  get isAdded() {
    return this._map && this._map.hasLayer(this);
  }

  /**
   * 对象的pid标识
   *
   * @type {String|Number}
   */
  get pid() {
    return this.options.pid;
  }
  set pid(pid) {
    this.options.pid = pid;
  }

  /**
   * 对象的id标识
   *
   * @type {String|Number}
   */
  get id() {
    return this.options.id;
  }
  set id(id) {
    this.options.id = id;
  }

  /**
   * 名称 标识
   *
   * @type {String}
   */
  get name() {
    return this.options.name;
  }
  set name(name) {
    this.options.name = name;
  }

  initialize(options) {
    let popupConifg;
    if (options.popup) {
      popupConifg = options.popup;
      delete options.popup;
    }
    let tooltipConifg;
    if (options.tooltip) {
      tooltipConifg = options.tooltip;
      delete options.tooltip;
    }

    super.initialize(conventGeojsonOptions(options));

    L.Util.stamp(this);
    this.options.id = mars2d.Util.defaultValue(this.options.id, this.uuid);
    this.options.pid = mars2d.Util.defaultValue(this.options.pid, -1);
    this.options.name = mars2d.Util.defaultValue(this.options.name, "");

    if (popupConifg) {
      this.bindPopup(
        (evt) => {
          // if (layer.hasOwnProperty("isPopup") && !layer.isPopup) {
          //   return;
          // }

          // if (_calbackClickFeature) {
          //   _calbackClickFeature("arcgis_feature", evt);
          // }

          let attr = evt.feature.properties;
          return mars2d.Util.getTemplateHtml({ title: this.options.name, template: popupConifg, attr: attr });
        },
        { maxWidth: 600 }
      );
    }
    if (tooltipConifg) {
      this.bindTooltip(
        (evt) => {
          let attr = evt.feature.properties;
          return mars2d.Util.getTemplateHtml({ title: this.options.name, template: tooltipConifg, attr: attr });
        },
        { direction: "top" }
      );
    }
  }

  /**
   * 遍历所有矢量数据并将其作为参数传递给回调函数
   *
   * @param {Function} method 回调方法
   * @param {Object} context  侦听器的上下文(this关键字将指向的对象)。
   * @return {GraphicLayer} 当前对象本身,可以链式调用
   * @example
   *
fl.on('load', function  () {
  fl.eachGraphic(function(layer) {
    console.log(layer.feature);
  });
}
   */
  eachGraphic(method, context) {
    return this.eachFeature(method, context);
  }

  /**
   * 根据Feature 的 id取矢量数据对象
   *
   * @param {String|Number} id  Feature 的 id
   * @return {L.Layer} 矢量数据对象
   */
  getGraphicById(id) {
    return this.getFeature(id);
  }
}

mars2d.layer.ArcGisFeatureLayer = ArcGisFeatureLayer;

//注册下
mars2d.LayerUtil.register("arcgis_feature", ArcGisFeatureLayer);

function conventGeojsonOptions(options) {
  if (!options.symbol) {
    return options;
  }

  let newopts = { ...options };

  if (options.symbol?.styleOptions) {
    //点图层
    newopts.pointToLayer = function (geojson, latlng) {
      let attr = geojson.properties;
      let markopt = getMarkerSymbolStyle(options.symbol, attr);
      return L.marker(latlng, markopt);
    };

    //线面图层
    newopts.style = function (geojson) {
      let attr = geojson.properties;
      let styleOpt = getSymbolStyle(options.symbol, attr);
      return styleOpt;
    };
  }

  return newopts;
}

// /**
//  * 根据symbol样式配置获取Marker点的构造参数
//  *
//  * @export
//  * @param {Object} symbol 样式配置信息
//  * @param {Object} symbol.styleOptions 样式信息
//  * @param {String} [symbol.styleField] 分类字段名称
//  * @param {Object} [symbol.styleFieldOptions] 分类字段值对应的样式
//  * @param {Object} [attr] 属性信息
//  * @param {Boolean} [isselected] 是否选中
//  * @return {Object} Marker构造参数
//  */
function getMarkerSymbolStyle(symbol, attr, isselected) {
  if (!symbol) {
    return {};
  }

  let icoOpt = { ...symbol.styleOptions };

  if (symbol.styleField && attr) {
    //存在多个symbol，按iconField进行分类
    let iconFieldVal = attr[symbol.styleField];
    let icoOptField = symbol.styleFieldOptions[iconFieldVal];
    if (icoOptField != null) {
      icoOpt = { ...icoOpt, ...icoOptField };
    }
  }

  if (isselected && icoOpt.iconUrlForSelect) {
    icoOpt.iconUrl = icoOpt.iconUrlForSelect;
  }

  if (icoOpt.hasOwnProperty("iconUrl")) {
    symbol.icon = L.icon(icoOpt);
  } else if (icoOpt.hasOwnProperty("iconFont")) {
    let fontsize = 20;
    if (icoOpt.hasOwnProperty("iconSize")) {
      fontsize = icoOpt.iconSize[0];
    }
    let color = icoOpt.color || "#000000";

    icoOpt.className = "";
    icoOpt.html = '<i class="' + icoOpt.iconFont + '" style="color:' + color + ";font-size:" + fontsize + 'px;"></i> ';
    symbol.icon = L.divIcon(icoOpt);
  } else {
    let color = icoOpt.color || "#0f89f5";
    let inhtml = '<div class="centerat_animation" style="color:' + color + ';"><p></p></div>';
    if (symbol.nameField) {
      let name = attr[symbol.nameField];
      inhtml += ' <div class="layer_divicon_name" style="top: 2px;left: 25px;" >' + name + "</div>";
    }

    symbol.icon = L.divIcon({
      className: "",
      iconSize: [10, 10],
      iconAnchor: [5, 5],
      popupAnchor: [5, -5],
      tooltipAnchor: [5, -5],
      html: inhtml,
    });
  }

  return symbol;
}

// /**
//  * 根据属性 和symbol配置 取线面的style样式信息
//  *
//  * @param {Object} symbol symbol配置
//  * @param {Object} symbol.styleOptions Style样式，每种不同类型数据都有不同的样式，具体见各矢量数据的style参数。{@link GraphicType}
//  * @param {String} [symbol.styleField] 按 styleField 属性设置不同样式。
//  * @param {Object} [symbol.styleFieldOptions] 按styleField值与对应style样式的键值对象。
//  * @param {Function} [symbol.callback] 自定义判断处理返回style ，示例：callback: function (attr, styleOpt){  return { color: "#ff0000" };  }
//  * @param {Object} [attr] 数据属性对象
//  * @param {Object} [mergeStyle] 需要合并到styleOptions的默认Style样式
//  * @return {Object} style样式
//  *
//  */
function getSymbolStyle(symbol, attr, mergeStyle = {}) {
  if (!symbol) {
    return {};
  }
  let styleOpt = symbol.styleOptions ? { ...mergeStyle, ...symbol.styleOptions } : { ...mergeStyle };

  if (symbol.styleField && attr) {
    //存在多个symbol，按styleField进行分类
    let styleFieldVal = attr[symbol.styleField];
    let styleOptField = symbol.styleFieldOptions[styleFieldVal];
    if (styleOptField != null) {
      styleOpt = { ...styleOpt, ...styleOptField };
    }
  }

  if (attr) {
    for (let key in styleOpt) {
      styleOpt[key] = mars2d.Util.template(styleOpt[key], attr);
    }
  }

  if (typeof symbol.callback == "function") {
    //只是动态返回symbol的自定义的回调方法，返回style
    let styleOptField = symbol.callback(attr, styleOpt);
    if (styleOptField != null) {
      styleOpt = { ...styleOpt, ...styleOptField };
    }
  }
  return styleOpt;
}

//以下是leaflet的内部方法，mars2d集成直接使用的，编写注释形成API文档

/**
 * 返回当前where设置
 * @return {String} where设置
 *
 * @function getWhere
 * @memberof ArcGisFeatureLayer
 * @instance
 */

/**
 * 设置新where选项并刷新图层以反映新where过滤器。
 * @param {String} where where设置
 * @param {Function} [callback] 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {ArcGisFeatureLayer} 当前对象本身，可以链式调用
 *
 * @function setWhere
 * @memberof ArcGisFeatureLayer
 * @instance
 */

/**
 * 请求有关此要素图层的元数据。将使用error和调用回调metadata。
 * @param {Function} callback 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {ArcGisFeatureLayer} 当前对象本身，可以链式调用
 * @example
featureLayer.metadata(function(error, metadata){
  console.log(metadata);
});
 * @function metadata
 * @memberof ArcGisFeatureLayer
 * @instance
 */

/**
 * 返回L.esri.Query可用于查询此服务的新对象。
 * @param {Function} callback 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {Object} [L.esri.Query对象]{@link http://esri.github.io/esri-leaflet/api-reference/tasks/query.html}
 * @example
featureLayer.query()
  .within(latlngbounds)
  .where("Direction = 'WEST'")
  .run(function(error, featureCollection){
    console.log(featureCollection);
  });
 * @function query
 * @memberof ArcGisFeatureLayer
 * @instance
 */

/**
 * 向要素图层添加新要素。如果创建成功，这也会将该功能添加到地图中。
 * <ul>
 * <li>需要以有权在 ArcGIS Online 中编辑服务的用户或创建服务的用户身份进行身份验证。</li>
 * <li>需要Create在服务上启用该功能。您可以通过在功能下检查服务的元数据来检查创建是否存在。</li>
 * </ul>
 * @param {Object} feature GeoJSON Feature对象
 * @param {Function} [callback] 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {ArcGisFeatureLayer} 当前对象本身，可以链式调用
 *
 * @function addFeature
 * @memberof ArcGisFeatureLayer
 * @instance
 */

/**
 * 更新要素图层上提供的要素。这也会更新地图上的要素。
 * <ul>
 * <li>需要以有权在 ArcGIS Online 中编辑服务的用户或创建服务的用户身份进行身份验证。</li>
 * <li>需要Create在服务上启用该功能。您可以通过在功能下检查服务的元数据来检查创建是否存在。</li>
 * </ul>
 * @param {Object} feature GeoJSON Feature对象
 * @param {Function} [callback] 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {ArcGisFeatureLayer} 当前对象本身，可以链式调用
 *
 * @function updateFeature
 * @memberof ArcGisFeatureLayer
 * @instance
 */

/**
 * 从要素图层中删除具有提供的 id 的要素。如果该要素存在，这也会从地图中删除该要素。
 * <ul>
 * <li>需要以有权在 ArcGIS Online 中编辑服务的用户或创建服务的用户身份进行身份验证。</li>
 * <li>需要Create在服务上启用该功能。您可以通过在功能下检查服务的元数据来检查创建是否存在。</li>
 * </ul>
 * @param {String|Number} id 要素的 id
 * @param {Function} [callback] 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {ArcGisFeatureLayer} 当前对象本身，可以链式调用
 *
 * @function deleteFeature
 * @memberof ArcGisFeatureLayer
 * @instance
 */

/**
 * 从要素层中删除具有提供的 id 的要素数组。这也会从地图中删除特征（如果存在）。
 * <ul>
 * <li>需要以有权在 ArcGIS Online 中编辑服务的用户或创建服务的用户身份进行身份验证。</li>
 * <li>需要Create在服务上启用该功能。您可以通过在功能下检查服务的元数据来检查创建是否存在。</li>
 * </ul>
 * @param {String[]|Number[]} ids 要素的id数组
 * @param {Function} [callback] 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {ArcGisFeatureLayer} 当前对象本身，可以链式调用
 *
 * @function deleteFeatures
 * @memberof ArcGisFeatureLayer
 * @instance
 */

/**
 * 从要素层使用提供的 id 重绘要素。
 * @param {String|Number} id 要素的 id
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 *
 * @function redraw
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 从地图上存在的要素图层重新绘制所有要素。
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 *
 * @function refresh
 * @memberof ArcGisDynamicLayer
 * @instance
 */
