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
}
