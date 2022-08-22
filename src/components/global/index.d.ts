// 引入naive对应的定义类型
import type { DialogApiInjection } from "naive-ui/lib/dialog/src/DialogProvider";
import type { MessageApiInjection } from "naive-ui/lib/message/src/MessageProvider";
import type { NotificationApiInjection } from 'naive-ui/lib/notification/src/NotificationProvider';


declare global {
    interface Window {
        $notification:NotificationApiInjection;
        $message: MessageApiInjection;
        $dialog: DialogApiInjection;
    }
}
