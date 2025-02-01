'use client';

import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DateTimePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);

  // Helper function to merge date and time
  const mergeDateAndTime = (date: Date, timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    return newDate;
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate) {
      onChange(value ? mergeDateAndTime(newDate, format(value, 'HH:mm')) : newDate);
    } else {
      onChange(undefined);
    }
  };

  const handleTimeChange = (time: string) => {
    if (selectedDate) {
      const newDateTime = mergeDateAndTime(selectedDate, time);
      onChange(newDateTime);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[280px] justify-start text-left font-normal', !value && 'text-muted-foreground')}
        >
          <CalendarIcon className='mr-2 size-4' />
          {value ? format(value, 'PPP p') : <span>Pick date and time</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className='border-t border-border p-3'>
          <Select
            onValueChange={handleTimeChange}
            value={value ? format(value, 'HH:mm') : undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select time' />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 * 4 }).map((_, i) => {
                const hours = Math.floor(i / 4);
                const minutes = (i % 4) * 15;
                const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                return (
                  <SelectItem
                    key={i}
                    value={timeString}
                  >
                    {timeString}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
