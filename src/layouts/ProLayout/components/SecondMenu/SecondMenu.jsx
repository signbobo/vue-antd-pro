import PropTypes from 'ant-design-vue/es/_util/vue-types'
import { inArray } from '@/utils/util'
import './index.less'

export default {
  name: 'SecondMenu',
  props: {
    // 子菜单标题
    subMenuTitle: PropTypes.string.def(''),
    // 子菜单数据
    subMenus: PropTypes.array.def(),
    // 是否收缩
    collapsed: PropTypes.bool.def(false)
  },
  data () {
    return {
      menuList: []
    }
  },
  created () {
    this.updateMenu(this.subMenus)
  },
  watch: {
    subMenus (newVal) {
      this.updateMenu(newVal)
    }
  },
  render (h) {
    return (
      <div class="menu-second">
        <div class="menu-title">
          <span>{this.subMenuTitle}</span>
        </div>
        <ul class="menu-list">
          {this.menuList.map(item => this.renderMenuItem(item))}
        </ul>
      </div>
    )
  },
  methods: {

    /**
     * 更新菜单
     * isHasChildren: 是否存在子菜单
     * isHideChildren: 是否隐藏子菜单
     */
    updateMenu (subMenus) {
      const menuList = []
      subMenus.forEach(item => {
        // 是否存在子菜单
        const isHasChildren = this.isHasChildren(item)
        const children = []
        isHasChildren && item.children.forEach(itm => {
          children.push({
            title: itm.meta.title,
            path: itm.path,
            hidden: itm.hidden,
            activePath: itm.activePath
          })
        })
        // 记录到显示的菜单列表
        menuList.push({
          title: item.meta.title,
          path: item.path,
          activePath: item.activePath,
          hidden: item.hidden,
          isHasChildren,
          isHideChildren: false,
          children
        })
      })
      this.menuList = menuList
    },

    /**
     * 判断二级菜单是否存在子菜单
     * @param {*} menuItem 二级菜单元素
     */
    isHasChildren (menuItem) {
      // 是否存在children
      const isHasChildren = menuItem.children !== undefined
      // 提取hidden的子菜单
      const hiddenChildren = isHasChildren ? menuItem.children.filter(itm => itm.hidden) : []
      // 判断是否存在未hidden的子菜单
      return isHasChildren && (hiddenChildren.length < menuItem.children.length)
    },

    /**
     * 切换子菜单显示隐藏
     * @param {*} menuItem
     */
    onToggleMenuSub (menuItem) {
      menuItem.isHideChildren = !menuItem.isHideChildren
    },

    /**
     * 渲染菜单项
     * @param {*} menuItem
     */
    renderMenuItem (menuItem) {
      // 隐藏菜单
      if (menuItem.hidden) {
        return null
      }
      // 激活子菜单的class
      const itemClass = ['menu-item_title']
      if (menuItem.isHasChildren && !menuItem.isHideChildren) {
        itemClass.push('show-children')
      }
      // 其他页面path激活当前项
      if (menuItem.activePath && menuItem.activePath.length) {
        inArray(this.$route.path, menuItem.activePath) && itemClass.push('router-link-active')
      }
      const renderTitle = () => {
        return <span>{menuItem.title}</span>
      }
      return (
        <li class="menu-item">
          {!menuItem.isHasChildren
            ? <router-link class={itemClass} to={{ path: menuItem.path }}>
              {renderTitle()}
            </router-link>
            : <a class={itemClass} href="javascript:;" onClick={() => this.onToggleMenuSub(menuItem)}>
              <a-icon class="icon" type="right" />
              {renderTitle()}
            </a>
          }
          {this.renderMenuSub(menuItem)}
        </li>
      )
    },

    /**
     * 渲染子菜单
     * @param {*} menuItem
     */
    renderMenuSub (menuItem) {
      return (
        (menuItem.isHasChildren && !menuItem.isHideChildren)
          ? <ul class="menu-sub">
            {menuItem.children.map(item => this.renderMenuSubItem(item))}
          </ul>
          : null
      )
    },

    /**
     * 渲染子菜单项
     * @param {*} subItem
     */
    renderMenuSubItem (subItem) {
      if (subItem.hidden) {
        return null
      }
      // 激活子菜单的class
      const itemClass = ['menu-sub-item_title']
      // 其他页面path激活当前项
      if (subItem.activePath && subItem.activePath.length) {
        inArray(this.$route.path, subItem.activePath) && itemClass.push('router-link-active')
      }
      return (
        <li class="menu-sub-item">
          <router-link class={itemClass} to={{ path: subItem.path }}>{subItem.title}</router-link>
        </li>
      )
    }
  }

}
