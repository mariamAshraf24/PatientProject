import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amPm',
  standalone: true,
})
export class AmPmPipe implements PipeTransform {

  transform(time: string): string {
    if (!time) return '';
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr);
    const minute = minuteStr;
    const ampm = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

}
