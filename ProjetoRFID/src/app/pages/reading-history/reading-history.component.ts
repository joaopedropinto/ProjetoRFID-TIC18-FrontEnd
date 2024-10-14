import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { Readout } from '../../models/readout.model';
import { ReadingService } from '../../services/reading/reading.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DatePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-reading-history',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    TooltipModule,
    DatePipe,
    DialogModule,
  ],
  templateUrl: './reading-history.component.html',
  styleUrl: './reading-history.component.css'
})
export class ReadingHistoryComponent implements OnInit {
  
  @ViewChild('table') table!: Table;
  readings!: Readout[];
  initialValue!: Readout[];
  isSorted: boolean | null = null;
  orderedColumn: string | null = null;

  loading: boolean = true;

  selectedReadout!: Readout;

  visibleDialog: boolean = false;
  
  constructor(
    private readingService: ReadingService,
    private datePipe: DatePipe,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.readingService.getAllReadings().subscribe((response) => {
      this.readings = response;
      this.initialValue = [...this.readings];
      this.loading = false;
    });
  }

  setSelectedReadout(readout: Readout) {
    this.selectedReadout = readout;
    this.router.navigate([`leituras/historico/${this.selectedReadout.id}`]);
  }

  formatDateTime(date: Date) {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm');
  }

  customSort(event: SortEvent) {
    if(event.field != this.orderedColumn) {
      this.isSorted = true;
      this.sortTableData(event);
    } else {
      if (this.isSorted == null || this.isSorted === undefined) {
          this.isSorted = true;
          this.sortTableData(event);
      } else if (this.isSorted == true) {
          this.isSorted = false;
          this.sortTableData(event);
      } else if (this.isSorted == false) {
          this.isSorted = null;
          this.readings = [...this.initialValue];
          this.table.reset();
      }
    }
  }

  sortTableData(event: SortEvent) {
    let result = null;
    const field = event.field as string;
    this.orderedColumn = field;
    event.data?.sort((data1, data2) => {
      if(event.field === 'readoutDate') {
        let value1 = data1[field];
        let value2 = data2[field];
        if (value1 == null && value2 != null) result = -1;
        else if (value1 != null && value2 == null) result = 1;
        else if (value1 == null && value2 == null) result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
        else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
      }
      else {
        result = data1.tags.length - data2.tags.length;
      }
        return event.order! * result;
    });
  }

  sortIconClass(fieldName: string): string {
    if(this.orderedColumn == fieldName) {
      if(this.isSorted) 
        return "pi pi-sort-up-fill";
  
      else if(this.isSorted == false) 
        return "pi pi-sort-down-fill";
    }
    
    return "pi pi-sort";
  }
}
