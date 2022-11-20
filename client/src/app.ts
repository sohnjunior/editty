import { defineCustomElements } from './registry'

export default class App {
  $root: HTMLElement

  constructor($root: HTMLElement) {
    this.$root = $root
    defineCustomElements()
    this.render()
  }

  render() {
    this.$root.innerHTML = '<text-box></text-box>'
  }
}
