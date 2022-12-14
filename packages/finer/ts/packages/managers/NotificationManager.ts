import Editor from 'finer/packages/Editor';
import DOM from 'finer/packages/dom/DOM';
import * as Icons from 'finer/packages/icons/Icons';

export enum ENotificationStatus {
	default,
	warning,
	error
}

interface INotificationManager {
	Show: () => void,
	Hide: () => void,
	Dispatch: (type: ENotificationStatus, text: string) => void,
}

const NotificationManager = (editor: Editor): INotificationManager => {
	const notification = editor.Frame.Notification;
	const stacks: Element[] = [];
	let status = ENotificationStatus.default;

	const Show = () => {
		DOM.Show(notification);
	};

	const Hide = () => {
		DOM.Hide(notification);
	};

	const Dispatch = (type: ENotificationStatus, text: string) => {
		if (editor.IsDestroyed()) return;
		Show();

		switch (type) {
			case ENotificationStatus.warning:
				console.warn(text);
				break;
			case ENotificationStatus.error:
				console.error(text);
				editor.Destroy();
				return;
			default:
				break;
		}

		if (type > status) status = type;

		const wrapper = DOM.Create('div', {
			attrs: {
				id: DOM.Utils.CreateUEID('message')
			},
			class: [
				DOM.Utils.CreateUEID('notification-message', false),
				DOM.Utils.CreateUEID(`notification-message-${ENotificationStatus[type]}`, false)
			],
			children: [
				DOM.Create('div', {
					class: DOM.Utils.CreateUEID('notification-message-text', false),
					html: text
				})
			]
		});

		const closeButton = DOM.Create('button', {
			class: DOM.Utils.CreateUEID('notification-message-icon', false),
			html: Icons.Close
		});

		DOM.On(closeButton, 'click', () => {
			DOM.Dispatch(wrapper, 'Notification:Close');
		});

		DOM.Insert(wrapper, closeButton);

		DOM.On(wrapper, 'Notification:Close', () => {
			const index: number = stacks.indexOf(wrapper);
			if (index !== -1) {
				stacks.splice(index, 1);
			}

			wrapper.remove();

			if (status !== ENotificationStatus.error && stacks.length === 0) {
				Hide();
			}
		});

		DOM.Insert(notification, wrapper);
		stacks.push(wrapper);
	};

	return {
		Show,
		Hide,
		Dispatch,
	};
};

export {
	INotificationManager,
	NotificationManager
};