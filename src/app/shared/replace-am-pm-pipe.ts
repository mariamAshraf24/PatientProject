import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceAmPm'
})
export class ReplaceAmPmPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .replace('AM', 'ص')
      .replace('PM', 'م');
  }
}
