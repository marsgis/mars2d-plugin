import L from "leaflet"
import * as LEsri from "esri-leaflet"
import * as mars2d from "mars2d"

/**
 * @typedef {Object} ArcGisFeatureLayer.EventType
 * 当前类支持的{@link EventType}事件类型（包括自定义字符串事件名）
 *
 * @property {String} loading 当新功能开始加载时触发。
 * @property {String} load 当地图当前边界中的所有要素都已加载时触发。
 *
 * @property {String} createfeature 首次加载要素图层中的要素时触发
 * @property {String} removefeature 当图层上的要素从地图中移除时触发
 * @property {String} addfeature 当先前删除的要素添加回地图时触发
 *
 * @property {String} click 当用户单击（or taps）地图时触发
 * @property {String} dblclick 当用户双击（or double-taps）地图时触发
 * @property {String} mousedown 当用户在图层上按下鼠标按钮时触发
 * @property {String} mouseover 当鼠标进入图层时触发
 * @property {String} mouseout 当鼠标离开图层时触发
 * @property {String} popupopen 当绑定到当前图层的Popup弹窗打开时触发
 * @property {String} popupclose 当绑定到当前图层的Popup弹窗关闭时触发
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
 * @param {Function} [options.onEachFeature] 提供了一个机会来内省图层中的各个 GeoJSON 功能。
 *
 * @param {Object|Function} [options.symbol] 矢量数据的style样式,为Function时是完全自定义的回调处理 symbol(attr, style, feature)
 * @param {GraphicType|String} [options.symbol.type] 标识数据类型，默认是根据数据生成 point、polyline、polygon
 * @param {Object} options.symbol.styleOptions Style样式，每种不同类型数据都有不同的样式，具体见各{@link GraphicType}矢量数据的style参数。
 * @param {String} [options.symbol.styleField] 按 styleField 属性设置不同样式。
 * @param {Object} [options.symbol.styleFieldOptions] 按styleField值与对应style样式的键值对象。
 * @param {Function} [options.symbol.callback] 自定义判断处理返回style ，示例：callback: function (attr, styleOpt){  return { color: "#ff0000" };  }
 *
 * @param {String|Globe.getTemplateHtml_template[]|Function} [options.popup]  绑定的popup弹窗值，也可以bindPopup方法绑定，支持：'all'、数组、字符串模板
 * @param {Map.PopupOptions} [options.popupOptions] popup弹窗时的配置参数
 *
 * @param {String|Number} [options.id = createGuid()] 图层id标识
 * @param {String|Number} [options.pid = -1] 图层父级的id，一般图层管理中使用
 * @param {String} [options.name = ''] 图层名称
 * @param {String} [options.pane = 'overlayPane'] 指定图层添加到地图的哪个pane的DIV中，用于控制不同层级显示的，优先级高于zIndex。
 * @export
 * @class ArcGisFeatureLayer
 * @extends {L.esri.FeatureLayer}
 * @see [支持的事件类型]{@link ArcGisFeatureLayer.EventType}
 * @see [更多请参考L.esri.FeatureLayer类API]{@link http://esri.github.io/esri-leaflet/api-reference/layers/feature-layer.html}
 */
export class ArcGisFeatureLayer extends LEsri.FeatureLayer {
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

  /**
   * 透明度
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

  initialize(options) {
    let popupConifg
    if (options.popup) {
      popupConifg = options.popup
      delete options.popup
    }
    let tooltipConifg
    if (options.tooltip) {
      tooltipConifg = options.tooltip
      delete options.tooltip
    }

    super.initialize(conventGeojsonOptions(options))

    L.Util.stamp(this)

    this.options.id = this.options.id ?? mars2d.Util.createGuid()
    this.options.pid = this.options.pid ?? -1
    this.options.show = this.options.show ?? true

    if (popupConifg) {
      const popupOptions = this.options.popupOptions || {}
      this.bindPopup(
        (evt) => {
          // if (layer.hasOwnProperty("isPopup") && !layer.isPopup) {
          //   return;
          // }

          // if (_calbackClickFeature) {
          //   _calbackClickFeature("arcgis_feature", evt);
          // }

          const attr = evt.feature?.properties
          if (!attr) {
            return ""
          }

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
    if (tooltipConifg) {
      const popupOptions = this.options.tooltipOptions || {}
      this.bindTooltip(
        (evt) => {
          const attr = evt.feature?.properties
          if (!attr) {
            return ""
          }

          let title = this.name
          if (popupOptions.noTitle) {
            title = null
          } else if (popupOptions.title) {
            title = popupOptions.title
          } else if (popupOptions.titleField) {
            title = attr[popupOptions.titleField]
          }
          return mars2d.Util.getTemplateHtml({ title: title, template: tooltipConifg, attr: attr })
        },
        { direction: "top" }
      )
    }
  }

  createNewLayer(options) {
    const layer = super.createNewLayer(options) // GeoJSON.geometryToLayer(geojson, this.options)
    if (layer) {
      layer.parent = this
    }
    return layer
  }

  /**
   * 遍历所有矢量数据并将其作为参数传递给回调函数
   *
   * @param {Function} method 回调方法
   * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
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
    return this.eachFeature(method, context)
  }

  /**
   * 根据Feature 的 id取矢量数据对象
   *
   * @param {String|Number} id  Feature 的 id
   * @return {L.Layer} 矢量数据对象
   */
  getGraphicById(id) {
    return this.getFeature(id)
  }

  /**
   *
   * 设置覆盖的透明度
   * @param {Number} opacity  透明度，取值范围 0-1
   * @return {ArcGisFeatureLayer} 当前对象本身,可以链式调用
   */
  setOpacity(opacity) {
    if (opacity === 0) {
      opacity = 0.001
    }
    this.options.opacity = opacity

    const newStyle = {
      opacity: this.options.opacity,
      fillOpacity: this.options.opacity
    }
    this.eachGraphic(function (graphic) {
      if (graphic.setOpacity) {
        graphic.setOpacity(opacity)
      } else if (graphic.setStyle) {
        graphic.setStyle(newStyle)
      }
    }, this)
    return this
  }

  /**
   * 获取图层矩形边界
   * @return {L.LatLngBounds} 矩形边界
   */
  getBounds() {
    let bounds
    this.eachFeature(function (layer) {
      if (layer.getBounds) {
        const thisBounds = layer.getBounds()
        if (bounds?._northEast) {
          bounds = bounds.extend(thisBounds)
        } else {
          bounds = thisBounds
        }
      } else if (layer.getLatLng) {
        const thisLatlng = layer.getLatLng()
        if (bounds?._northEast) {
          bounds = bounds.extend(thisLatlng)
        } else {
          bounds = L.latLngBounds(thisLatlng, thisLatlng)
        }
      }
    }, this)
    return bounds
  }

  /**
   * 定位地图至当前图层数据区域
   *
   * @param {Object} [options] 定位参数，包括:
   * @param {L.Point|Number[]} [options.paddingTopLeft] 设置在将视图设置为适合边界时不应考虑的地图容器左上角的填充量。如果您在地图上有一些控件重叠式（如侧边栏），而且您不希望它们遮挡您正在缩放的对象，则很有用。
   * @param {L.Point|Number[]} [options.paddingBottomRight] 同上，不考虑地图容器右下角时使用。
   * @param {L.Point|Number[]} [options.padding] 相当于将左上和右下填充设置为相同的值。
   * @param {Number} [options.maxZoom] 最大层级
   * @param {Boolean} [options.animate=true] 是否进行动画缩放。false时始终重置视图完全没有动画。
   * @param {Number} [options.duration=0.25] 动画平移的持续时间，以秒为单位。
   * @param {Number} [options.easeLinearity=0.25] 平移动画宽松的曲率因子 [Cubic Bezier curve曲线]{@link https://cubic-bezier.com/}的第三个参数。1.0表示线性动画，而这个数字越小，曲线越鞠躬。
   * @param {Boolean} [options.noMoveStart=false] 如果true，平移不会movestart在启动时触发事件（内部用于平移惯性）。
   * @return {ArcGisFeatureLayer} 当前对象本身，可以链式调用
   */
  flyTo(options) {
    if (this._map) {
      const bounds = this.getBounds()
      if (bounds?._northEast) {
        this._map.flyToBounds(bounds, options)
      }
    }
    return this
  }
}

mars2d.layer.ArcGisFeatureLayer = ArcGisFeatureLayer

// 注册下
mars2d.LayerUtil.register("arcgis_feature", ArcGisFeatureLayer)

function conventGeojsonOptions(options) {
  if (!options.symbol) {
    return options
  }

  const newopts = { ...options }

  if (options.symbol?.styleOptions) {
    // 点图层
    newopts.pointToLayer = function (geojson, latlng) {
      const attr = geojson.properties
      const markopt = getMarkerSymbolStyle(options.symbol, attr)
      return L.marker(latlng, markopt)
    }
    // 线面图层
    newopts.style = function (geojson) {
      const attr = geojson.properties
      const styleOpt = mars2d.Util.getSymbolStyle(options.symbol, attr)
      return mars2d.PolygonStyleConver.toLeafletVal(styleOpt)
    }

    if (mars2d.Util.defined(options.symbol.type)) {
      if (mars2d.GraphicUtil.isPointType(options.symbol.type)) {
        delete newopts.style
      } else {
        delete newopts.pointToLayer
      }
    }
  }

  return newopts
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
    return {}
  }

  let icoOpt = { ...symbol.styleOptions }

  if (symbol.styleField && attr) {
    // 存在多个symbol，按iconField进行分类
    const iconFieldVal = attr[symbol.styleField]
    const icoOptField = symbol.styleFieldOptions[iconFieldVal]
    if (icoOptField != null) {
      icoOpt = { ...icoOpt, ...icoOptField }
    }
  }

  if (isselected && icoOpt.iconUrlForSelect) {
    icoOpt.iconUrl = icoOpt.iconUrlForSelect
  }

  if (icoOpt.hasOwnProperty("image")) {
    symbol.icon = L.icon({ iconUrl: icoOpt.image, ...icoOpt })
  } else if (icoOpt.hasOwnProperty("iconUrl")) {
    symbol.icon = L.icon(icoOpt)
  } else if (icoOpt.hasOwnProperty("iconFont")) {
    let fontsize = 20
    if (icoOpt.hasOwnProperty("iconSize")) {
      fontsize = icoOpt.iconSize[0]
    }
    const color = icoOpt.color || "#000000"

    icoOpt.className = ""
    icoOpt.html = '<i class="' + icoOpt.iconFont + '" style="color:' + color + ";font-size:" + fontsize + 'px;"></i> '
    symbol.icon = L.divIcon(icoOpt)
  } else {
    const color = icoOpt.color || "#0f89f5"
    let inhtml = '<div class="centerat_animation" style="color:' + color + ';"><p></p></div>'
    if (symbol.nameField) {
      const name = attr[symbol.nameField]
      inhtml += ' <div class="layer_divicon_name" style="top: 2px;left: 25px;" >' + name + "</div>"
    }

    symbol.icon = L.divIcon({
      className: "",
      iconSize: [10, 10],
      iconAnchor: [5, 5],
      popupAnchor: [5, -5],
      tooltipAnchor: [5, -5],
      html: inhtml
    })
  }

  return symbol
}

// 以下是leaflet的内部方法，mars2d集成直接使用的，编写注释形成API文档

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
