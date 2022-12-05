import { defineCustomElements } from './registry'
import './global.css'

export default class App {
  $root: HTMLElement

  constructor($root: HTMLElement) {
    this.$root = $root
    defineCustomElements()
    this.render()
  }

  render() {
    this.$root.innerHTML = `
      <v-mobile-layout>
        <main slot="main">
          <h1>Hello World!</h1>
          <v-button></v-button>
        </main>
      </v-mobile-layout>
    `
  }
}
