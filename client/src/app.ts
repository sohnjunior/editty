import TextBox from './components/text-box'

export default class App {
  $root: HTMLElement

  constructor($root: HTMLElement) {
    this.$root = $root
    this.defineCustomElements()
    this.render()
  }

  defineCustomElements() {
    customElements.define(TextBox.displayName, TextBox)
  }

  render() {
    this.$root.innerHTML = '<text-box></text-box>'
  }
}
