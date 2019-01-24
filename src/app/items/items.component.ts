import { Component } from '@angular/core';
import { ItemsService } from './items.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: [ './items.component.css' ]
})
export class ItemsComponent  {
  
  constructor( private service: ItemsService,) { }

  items$: Array<any>;

  filterForm = new FormGroup({
    minControl: new FormControl(),
    maxControl: new FormControl(),
  });

  min: number = 0;
  max: number = Number.MAX_SAFE_INTEGER;

  ngOnInit() {

    this.createList();

  }

  filterList(){

    let pass: boolean = true;

    if(this.filterForm.value.minControl === null && this.filterForm.value.maxControl === null){
      alert("You must enter a value for both filters");
      pass = false;
    }
    else if(this.filterForm.value.minControl >= this.filterForm.value.maxControl){
      alert("Please enter a Minimum value which is smaller than the Maximum value");
      pass = false;
    }
    else if(this.filterForm.value.minControl < 0 || this.filterForm.value.maxControl < 0){
      alert("Please don't use negative numbers");
      pass = false;
    }
    else if(this.filterForm.value.minControl === null || this.filterForm.value.maxControl === null){
      alert("You must enter a number for both Maximum and Minimum");
      pass = false;
    }
    if(pass){

      this.min = this.filterForm.value.minControl;
      this.max = this.filterForm.value.maxControl;

      this.createList();
    }
  }
  
  createList(){
    this.items$ = [];
    
    this.service.getItems().subscribe(res => {
      
      this.items$ = res.result.hits;
      let tempList:Array<any> = [];

      this.items$.forEach(element => {
        let hit: Object;
        let correctUrl: string = this.sortColor(element, "RED");
        let longPrice: boolean;
        
        if(element.partSummary.priceRanges.retail.start > this.min && element.partSummary.priceRanges.retail.end < this.max){
          
          if(element.partSummary.priceRanges.retail.start === element.partSummary.priceRanges.retail.end)
            longPrice = true;
          else
            longPrice = false;

          hit = this.createHit(element, correctUrl, longPrice);

          tempList.push(hit);
        }
      })

      if(tempList.length == 0){
        var noResultsFoundHit = {name: "No results found!", msrp: ""};
        tempList.push(noResultsFoundHit);
      }

      this.items$ = tempList;

    });
  }

  sortColor(element, color) : string{
    let url: string = "";
    element.parts.forEach(function(p){
      if(p.description.includes(color)){
        url = p.primaryMedia.url;
      }
    })
    return url;
  }

  createHit(element, correctUrl, longprice: boolean) : any {
    
    let hit = { id: element.publicId,
      name: element.name,
      img: "https://asset.lemansnet.com/"+ correctUrl +".png?x=176&y=176&b=&t=image/png",
      brand: element.brand.name,
      msrp: "MSRP",
      price: '',
    }

    if(longprice)
      hit.price = "$"+element.partSummary.priceRanges.retail.start + " - " + "$"+element.partSummary.priceRanges.retail.end;
    else
      hit.price = "$"+element.partSummary.priceRanges.retail.start;

    return hit;
  }

}
