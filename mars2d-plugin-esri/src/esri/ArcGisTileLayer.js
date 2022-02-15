import L from "leaflet";
import * as LEsri from "esri-leaflet";
import * as mars2d from "mars2d";

/**
 * ArcGIS Server 瓦片地图服务图层，
 * 【需要引入mars2d-esri 插件库】
 *
 * @param {Object} options 参数对象，包括以下：
 * @param {String} options.url ArcGIS Server服务地址,比如：'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/World/MODIS/ImageServer'
 * @param {num} [options.zoomOffsetAllowance=0.1] 如果启用correctZoomLevels，这将控制重新映射贴图级别的每个缩放级别上的差异的容错量。
 *
 * @param {String} [options.token] 如果您在服务需要传递令牌，它将包含在对服务的所有请求中。
 * @param {String} [options.proxy]  代理服务URL
 * @param {Boolean} [options.useCors=true] 如果此服务在发出 GET 请求时应使用 CORS。
 *
 *  @param {Number} [options.opacity=1] 瓦片的不透明度。
 * @param {Number} [options.minZoom=0] 最小的缩放级别
 * @param {Number} [options.maxZoom=18] 最大的缩放级别
 * @param {Number} [options.maxNativeZoom] 瓦片来源可用的最大缩放倍数。如果指定，则所有缩放级别上的图块maxNativeZoom将高于将从maxNativeZoom级别加载并自动缩放。
 * @param {Number} [options.minNativeZoom] 瓦片来源可用的最小缩放数。如果指定，所有缩放级别上的图块minNativeZoom将从minNativeZoom级别加载并自动缩放。
 * @param {Number} [options.zIndex=1] 瓦片层的显式zIndex
 * @param {L.LatLngBounds} [options.bounds] 自定义加载的瓦片矩形范围
 * @param {String} [options.errorTileUrl] 显示加载瓦片失败时，显示的图片的url
 * @param {Boolean} [options.tms] 如果此值为true，反转切片Y轴的编号（对于TMS服务需将此项打开）
 * @param {Boolean} [options.zoomReverse=false] 如果设置为true，则URL网址中使用的缩放z数字将被颠倒（maxZoom - zoom而不是zoom）
 * @param {Number} [options.xOffset] 对URL中地图的缩放级别x值加上xOffset值
 * @param {Number} [options.yOffset] 对URL中地图的缩放级别y值加上yOffset值
 * @param {Number} [options.zOffset] 对URL中地图的缩放级别z值加上zOffset值
 * @param {Function} [options.customTags] 自定义对瓦片请求参数处理
 * @param {Number|L.Point} [options.tileSize=256] 网格中瓦片的宽度和高度。如果宽度和高度相等，则使用数字，否则L.point(width, height)。
 * @param {String} [options.className] 要分配给瓦片图层的自定义类名称
 * @param {Number} [options.keepBuffer=2] 当平移地图时，在卸载它们之前，先保留许多行和列的数据块。
 * @param {Boolean} [options.detectRetina=false] 如果此项为true，并且用户是视网膜显示模式，会请求规定大小一般的四个切片和一个地区内一个更大的缩放级别来利用高分辨率.
 * @param {Boolean} [options.crossOrigin=false] 如果为true，则所有图块将其crossOrigin属性设置为“*”。如果要访问像素数据，则需要这样做。
 * @param {Number} [options.updateInterval=200] 当平移时，updateInterval毫秒不会更新一次瓦片。
 * @param {Boolean} [options.updateWhenZooming=true] 默认情况下，平滑缩放动画（touch zoom 或flyTo()） 会在整个缩放级别更新网格图层。设置此选项false将仅在平滑动画结束时更新网格层。
 * @param {Boolean} [options.noWrap=false] 该层是否在子午线断面。 如果为true，GridLayer只能在低缩放级别显示一次。当地图CRS 不包围时，没有任何效果。 可以结合使用bounds 以防止在CRS限制之外请求瓦片。
 * @param {ChinaCRS} [options.chinaCRS] 标识瓦片的国内坐标系（用于自动纠偏或加偏），自动将瓦片转为map对应的chinaCRS类型坐标系。
 *
 * @param {String|Number} [options.id = uuid()] 图层id标识
 * @param {String|Number} [options.pid = -1] 图层父级的id，一般图层管理中使用
 * @param {String} [options.name = ''] 图层名称
 *
 * @export
 * @class ArcGisTileLayer
 * @extends {L.esri.TiledMapLayer}
 * @see [支持的事件类型]{@link TileLayer.EventType}
 * @see [更多请参考L.esri.TiledMapLayer类API]{@link http://esri.github.io/esri-leaflet/api-reference/layers/tiled-map-layer.html}
 */
export class ArcGisTileLayer extends LEsri.TiledMapLayer {
  initialize (options) {
		super.initialize(options);

    L.Util.stamp(this);
    this.options.id = mars2d.Util.defaultValue(this.options.id, this.uuid);
    this.options.pid = mars2d.Util.defaultValue(this.options.pid, -1);
    this.options.name = mars2d.Util.defaultValue(this.options.name, "");
	}

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
}
mars2d.layer.ArcGisTileLayer = ArcGisTileLayer;

//注册下
mars2d.LayerUtil.register("arcgis_tile", ArcGisTileLayer);

//以下是leaflet的内部方法，mars2d集成直接使用的，编写注释形成API文档

/**
 * 请求有关此要素图层的元数据。将使用error和调用回调metadata。
 * @param {Function} callback 回调方法
 * @param {Object} [context]  侦听器的上下文(this关键字将指向的对象)。
 * @return {ArcGisTileLayer} 当前对象本身，可以链式调用
 * @example
dynamicMapLayer.metadata(function(error, metadata){
  console.log(metadata);
});
 * @function metadata
 * @memberof ArcGisTileLayer
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
 * @memberof ArcGisTileLayer
 * @instance
 */
