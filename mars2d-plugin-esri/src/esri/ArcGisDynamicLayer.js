import L from "leaflet"
import * as LEsri from "esri-leaflet"
import * as mars2d from "mars2d"

/**
 * @typedef {Object} ArcGisDynamicLayer.EventType
 * 当前类支持的{@link EventType}事件类型（包括自定义字符串事件名）
 *
 * @property {String} loading 当新功能开始加载时触发。
 * @property {String} load 当地图当前边界中的所有要素都已加载时触发。
 *
 * @property {String} requeststart 当对服务的请求开始时触发。
 * @property {String} requestend 当对服务的请求结束时触发。
 * @property {String} requestsuccess 当对服务的请求成功时触发。
 * @property {String} requesterror 当对服务的请求响应错误时触发。
 * @property {String} authenticationrequired 当对服务的请求失败并需要身份验证时，这将被触发。
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
 *
 * ArcGIS Server 动态服务图层，
 * 【需要引入mars2d-esri 插件库】
 *
 * @param {Object} options 参数对象，包括以下：
 * @param {String} options.url ArcGIS Server服务地址，如：https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer/
 * @param {String[]} [options.layers] 一个层id的数组，显示服务中的指定图层集合。
 * @param {Object} [options.layerDefs] SQL筛选器，以定义服务呈现的图像中包含哪些特性。对象与键一起使用，将每个查询映射到其各自的层。{ 3: "STATE_NAME='Kansas'", 9: "POP2007>25000" }
 * @param {String} [options.format='png24'] 图像的输出格式
 * @param {Boolean} [options.transparent=true] 是否允许服务器产生透明的图像。
 * @param {Number} [options.opacity=1] 图层的不透明度。应该是介于0(完全透明)和1(完全不透明)之间的值。
 * @param {Object} [options.dynamicLayers] 用于覆盖服务定义的图层符号系统的一个或多个 JSON 对象的数组。需要哪些支持10.1+地图服务请求。
 * @param {Boolean} [options.disableCache=false] 如果启用，将时间戳附加到每个请求以确保在服务器端创建新图像。
 *
 * @param {Number} [options.minZoom] 图层将显示在地图上的最远缩放级别。
 * @param {Number} [options.maxZoom] 图层将显示在地图上的最近缩放级别。
 * @param {String} [options.token] 如果您在服务需要传递令牌，它将包含在对服务的所有请求中。
 * @param {String} [options.proxy]  代理服务URL
 * @param {Boolean} [options.useCors=true] 如果此服务在发出 GET 请求时应使用 CORS。
 * @param {Number} [options.zIndex] 用于图层间排序
 *
 * @param {String|Globe.getTemplateHtml_template[]|Function} [options.popup]  绑定的popup弹窗值，也可以bindPopup方法绑定，支持：'all'、数组、字符串模板
 * @param {Map.PopupOptions} [options.popupOptions] popup弹窗时的配置参数
 * @param {object} [highlight] 鼠标移单击后高亮对应的矢量对象的样式
 *
 * @param {String|Number} [options.id = createGuid()] 图层id标识
 * @param {String|Number} [options.pid = -1] 图层父级的id，一般图层管理中使用
 * @param {String} [options.name = ''] 图层名称
 * @param {String} [options.pane = 'tilePane'] 指定图层添加到地图的哪个pane的DIV中，用于控制不同层级显示的，优先级高于zIndex。
 * @export
 * @class ArcGisDynamicLayer
 * @extends {L.esri.DynamicMapLayer}
 * @see [支持的事件类型]{@link ArcGisDynamicLayer.EventType}
 * @see [更多请参考L.esri.DynamicMapLayer类API]{@link http://esri.github.io/esri-leaflet/api-reference/layers/dynamic-map-layer.html}
 */
export class ArcGisDynamicLayer extends LEsri.DynamicMapLayer {
  /**
   * 是否已添加到地图
   *
   * @type {Boolean}
   * @readonly
   *
   */
  get isAdded() {
    return this._map && this._map.hasLayer(this)
  }

  /**
   * 对象的pid标识
   *
   * @type {String|Number}
   */
  get pid() {
    return this.options.pid
  }

  set pid(pid) {
    this.options.pid = pid
  }

  /**
   * 对象的id标识
   *
   * @type {String|Number}
   */
  get id() {
    return this.options.id
  }

  set id(id) {
    this.options.id = id
  }

  /**
   * 名称 标识
   *
   * @type {String}
   */
  get name() {
    return this.options.name
  }

  set name(name) {
    this.options.name = name
  }

  /**
   * 透明度
   *
   * @type {Number}
   */
  get opacity() {
    return this.options.opacity
  }

  set opacity(value) {
    this.options.opacity = value
    this.setOpacity(value)
  }

  /**
   * 是否可以调整透明度
   * @type {boolean}
   * @readonly
   */
  get hasOpacity() {
    return true
  }

  /**
   * 显示隐藏状态
   *
   * @type {Boolean}
   */
  get show() {
    return this.options.show
  }

  set show(show) {
    if (this.options.show === show) {
      return
    }
    this.options.show = show

    if (show) {
      if (this._map) {
        this.addTo(this._map)
      }
    } else {
      const map = this._map
      this.remove()
      this._map = map
    }
  }

  initialize(options) {
    let popupConifg
    if (options.popup) {
      popupConifg = options.popup
      delete options.popup
    }

    options.pane = options.pane ?? "tilePane"
    // options.show = options.show ?? true

    super.initialize(options)

    L.Util.stamp(this)
    this.options.id = this.options.id ?? mars2d.Util.createGuid()
    this.options.pid = this.options.pid ?? -1

    if (popupConifg) {
      const popupOptions = this.options.popupOptions || {}
      this.bindPopup(
        (error, data, response) => {
          if (error != null && error.code > 0) {
            mars2d.Util.msg(error.message)
            return false
          }
          const graphic = data.graphic
          if (!graphic) {
            return false
          }

          const attr = graphic.attr

          let title = this.name
          if (popupOptions.noTitle) {
            title = null
          } else if (popupOptions.title) {
            title = popupOptions.title
          } else if (popupOptions.titleField) {
            title = attr[popupOptions.titleField]
          }
          return mars2d.Util.getTemplateHtml({ title: title, template: popupConifg, attr: attr })
        },
        { maxWidth: 600 }
      )
    }
  }

  onAdd(map) {
    super.onAdd(map)

    setTimeout(() => {
      if (this._map && !this._popup && (this.highlight || this.listens("click"))) {
        this._map.on("click", this._getPopupData, this)
        this._map.on("dblclick", this._resetPopupState, this)
      }
    }, 1000)
  }

  _renderPopup(latlng, error, results, response) {
    const highlightStyle = this.options?.highlight
    const graphicsOptions = mars2d.Util.geoJsonToGraphics(results, {
      type: highlightStyle?.type,
      style: highlightStyle
    })

    const data = {
      layer: this,
      graphic: graphicsOptions.length > 0 ? graphicsOptions[0] : null,
      graphics: graphicsOptions,
      geojson: results,
      latlng: latlng
    }

    if (this._popup) {
      super._renderPopup(latlng, error, data, response)
    }

    if (graphicsOptions && highlightStyle) {
      if (!this._graphicLayer) {
        this._graphicLayer = new mars2d.layer.GraphicLayer({
          name: "高亮对象图层",
          isPrivate: true
        })
        this._map.addLayer(this._graphicLayer)
      }
      this._graphicLayer.clear()
      this._graphicLayer.addGraphic(graphicsOptions)

      if (this._popup) {
        this._popup._source = this
        this.once(mars2d.EventType.popupclose, (e) => {
          this._graphicLayer.clear()
        })
      }
    }

    if (this.listens("click")) {
      this.fire(mars2d.EventType.click, data)
    }
  }
}

mars2d.layer.ArcGisDynamicLayer = ArcGisDynamicLayer

// 注册下
mars2d.LayerUtil.register("arcgis_dynamic", ArcGisDynamicLayer)

// 以下是leaflet的内部方法，mars2d集成直接使用的，编写注释形成API文档

/**
 * 在所有其他叠加层下方重绘此层。
 * @return {ArcGisDynamicLayer} 当前对象本身,可以链式调用
 *
 * @function bringToBack
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 在所有其他叠加层之上重绘此层。
 * @return {ArcGisDynamicLayer} 当前对象本身,可以链式调用
 *
 * @function bringToFront
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 绑定Popup弹窗配置
 * @param {Function} content Popup弹窗回调方法
 * @param {Map.PopupOptions|Object} [options] Popup弹窗参数
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 * @example
dynamicMapLayer.bindPopup(function(err, featureCollection, response){
    var count = featureCollection.features.length;
    return (count) ? count + ' features' : false;
});
 *
 * @function bindPopup
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 解除绑定Popup弹窗配置
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 *
 * @function unbindPopup
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 返回层构造函数中指定的可见层数组。
 * @return {String[]} 可见层数组
 *
 * @function getLayers
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 重绘图层以显示传递的图层 id 数组。
 * @param {String[]} layers 可见层数组
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 *
 * @function setLayers
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 返回用于渲染的当前层SQL筛选器。
 * @return {Object} SQL筛选器
 *
 * @function getLayerDefs
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 使用SQL筛选器新图层定义重绘图层, [layerDefs]{@link https://developers.arcgis.com/rest/services-reference/enterprise/export-map.htm}选项。
 * @param {Object} layerDefs SQL筛选器
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 *
 * @function setLayerDefs
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 返回一组 JSON 对象，表示从地图服务请求的修改后的图层符号系统。
 * @return {Object[]} SQL筛选器
 *
 * @function getDynamicLayers
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 在您想要修改服务本身中定义的图层符号系统的情况下，用于以数组形式插入原始 dynamicLayers JSON。
 * @param {Object[]} dynamicLayers SQL筛选器
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 *
 * @function setDynamicLayers
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 请求有关此要素图层的元数据。将使用error和调用回调metadata。
 * @param {Function} callback 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 * @example
dynamicMapLayer.metadata(function(error, metadata){
  console.log(metadata);
});
 * @function metadata
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 返回一个IdentifyFeatures新对象，可用于识别该图层上的要素。您的回调函数将传递一个带有结果或错误的GeoJSON。
 * @param {Function} callback 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {Object} [L.esri.services.IdentifyFeatures对象]{@link http://esri.github.io/esri-leaflet/api-reference/tasks/identify-features.html}
 * @example
dynamicMapLayer.identify()
  .at(latlng)
  .run(function(error, featureCollection){
    console.log(featureCollection);
  });
 * @function identify
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 返回IdentifyFeatures可用于查找特征的新对象。您的回调函数将传递一个带有结果或错误的GeoJSON。
 * @param {Function} callback 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {Object} [L.esri.Find对象]{@link http://esri.github.io/esri-leaflet//api-reference/tasks/find.html}
 * @example
dynamicMapLayer.find()
  .layers('18')
  .text('Colorado')
  .run(function(error, featureCollection){
    console.log(featureCollection);
  });
 * @function find
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 返回L.esri.Query可用于查询此服务的新对象。
 * @param {Function} callback 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {Object} [L.esri.Query对象]{@link http://esri.github.io/esri-leaflet/api-reference/tasks/query.html}
 * @example
mapService.query()
  .layer(0)
  .within(latlngbounds)
  .run(function(error, featureCollection, response){
    console.log(featureCollection);
  });
 * @function query
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 用于向服务发出新请求并绘制响应。
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 *
 * @function redraw
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 将图层添加到地图
 * @param {Map} map  地图对象
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 *
 * @function addTo
 * @memberof ArcGisDynamicLayer
 * @instance
 */

/**
 * 将图层从地图上移除
 * @return {ArcGisDynamicLayer} 当前对象本身，可以链式调用
 *
 * @function remove
 * @memberof ArcGisDynamicLayer
 * @instance
 */
