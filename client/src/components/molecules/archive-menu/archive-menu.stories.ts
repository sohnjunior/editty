import { html } from 'lit-html'
import VArchiveMenu from './archive-menu'

export default {
  title: 'Molecules / Archive Menu',
}

interface Props {
  open: boolean
  value: string
}

export const Basic = ({ open, value }: Props) => {
  const lazyLoadArchiveData = () => {
    setTimeout(() => {
      const $menu = document.querySelector<VArchiveMenu>('v-archive-menu')
      if ($menu) {
        $menu.archives = [
          { id: '1', title: '스냅샷1' },
          { id: '2', title: '스냅샷2' },
          { id: '3', title: '스냅샷3' },
          { id: '4', title: '스냅샷4' },
          { id: '5', title: '스냅샷5' },
          { id: '6', title: '스냅샷6' },
          { id: '7', title: '스냅샷7' },
        ]
      }
    }, 1000)
  }
  lazyLoadArchiveData()

  return html`<v-archive-menu open="${open}" value="${value}"></v-archive-menu>`
}
Basic.args = {
  open: true,
  value: '1',
}
