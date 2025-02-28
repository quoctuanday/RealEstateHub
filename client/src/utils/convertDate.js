import { formatDate } from 'date-fns';

export default function dateConvert(date) {
    return formatDate(new Date(date), 'dd/MM/yyyy ');
}
