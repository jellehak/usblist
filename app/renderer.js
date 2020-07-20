// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const serialport = require('serialport')

const { remote } = require('electron')
const { BrowserWindow } = remote
const currentWindow = remote.getCurrentWindow()
// console.log(mainWindow)

const { Tray, Menu } = remote

const vue = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: vm => ({
    items: [],
    form: {
      refreshRate: 3000
    },
    headers: [
      // path	manufacturer	serialNumber	pnpId	locationId	vendorId	productId
      {
        text: 'path',
        value: 'path'
      },
      { text: 'manufacturer', value: 'manufacturer' },
      { text: 'serialNumber', value: 'serialNumber' },
      { text: 'pnpId', value: 'pnpId' },
      { text: 'locationId', value: 'locationId' },
      { text: 'vendorId', value: 'vendorId' },
      { text: 'productId', value: 'productId' }
    ]
  }),

  mounted () {
    this.refresh()
    setInterval(this.refresh, this.form.refreshRate)

    // Create Tray

    const tray = new Tray(`${__dirname}/logo.png`)
    const trayMenuTemplate = [
      // ...ports.map(elem => ({
      //   label: elem.path,
      //   click: function () {
      //     console.log('Clicked on Help')
      //   }
      // })),
      {
        label: 'Help',
        click: function () {
          console.log('Clicked on Help')
        }
      }
    ]

    const trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
    tray.setContextMenu(trayMenu)
    this.tray = tray
  },

  methods: {
    async refresh () {
      await serialport.list()
        .then((ports) => {
          console.log('ports', ports)
          // document.getElementById('error').textContent = ''

          const trayMenuTemplate = [
            ...ports.map(elem => ({
              label: elem.path,
              click: function () {
                console.log('Clicked on Help')
              }
            })),
            {
              label: 'Help',
              click: function () {
                console.log('Clicked on Help')
              }
            }
          ]

          const trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
          this.tray.setContextMenu(trayMenu)

          // Update table
          this.items = ports
        })
        .catch(err => {
          // document.getElementById('error').textContent = err.message
          alert(err.message)
        })
    }
  }
})
