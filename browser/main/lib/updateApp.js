import i18n from 'browser/lib/i18n'
import ConfigManager from 'browser/main/lib/ConfigManager'
import store from 'browser/main/store'

const electron = require('electron')
const { remote, ipcRenderer } = electron
const { dialog } = remote

export function updateApp () {
  const config = ConfigManager.get()

  if (config.ui.updateNotification) {
    const index = dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'warning',
      message: i18n.__('Update Boostnote'),
      detail: i18n.__('New Boostnote is ready to be installed.'),
      buttons: [i18n.__('Restart & Install'), i18n.__('Not Now'), i18n.__('Not Show Again')]
    })

    if (index === 0) {
      ipcRenderer.send('update-app-confirm')
    } else if (index === 2) {
      const newConfig = Object.assign({}, config)
      newConfig.ui.updateNotification = false

      ConfigManager.set(newConfig)

      store.dispatch({
        type: 'SET_UI',
        config: newConfig
      })
    }
  }
}
