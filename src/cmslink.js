import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview'
import Plugin from '@ckeditor/ckeditor5-core/src/plugin'
import LinkUI from '@ckeditor/ckeditor5-link/src/linkui'
import searchIcon from '@ckeditor/ckeditor5-cmslink/theme/icons/search.svg'

export default class Cmslink extends Plugin {
	init() {
		const editor = this.editor
		const config = editor.config.get('cmslink')
		const onExecute = config && config.execute
		if (!onExecute) return
		this.onExecute = onExecute

		const linkUI = editor.plugins.get(LinkUI)

		this.linkFormView = linkUI.formView
		this.button = this._createButton()

		this.linkFormView.once('render', () => {
			this.button.render()
			this.linkFormView.registerChild(this.button)
			this.linkFormView.element.insertBefore(this.button.element, this.linkFormView.saveButtonView.element)
		})
	}

	_createButton() {
		const button = new ButtonView( this.locale )

		button.set({
      icon: searchIcon,
			label: 'Internal page lookup',
			withText: false,
			tooltip: true
		})

		button.on('execute', () => {
			this.linkFormView.listenTo(document, 'mousedown', this._stopMouseDownEvent, { priority: 'highest' })

      this.onExecute((url) => {
				this.linkFormView.stopListening(document, 'mousedown', this._stopMouseDownEvent)
				this.linkFormView.urlInputView.fieldView.value = url
			}, () => {
				this.linkFormView.stopListening(document, 'mousedown', this._stopMouseDownEvent)
			})
		})

		return button
	}

	_stopMouseDownEvent(evt) {
		evt.stop()
	}
}