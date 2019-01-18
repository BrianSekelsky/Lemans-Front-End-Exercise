import { Component } from '@angular/core';
import { ItemsService } from './items.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: [ './items.component.css' ]
})
export class ItemsComponent  {

  items$: Array<any>;
  
  constructor( private service: ItemsService,) { }

  filterForm = new FormGroup({
    minControl: new FormControl(),
    maxControl: new FormControl(),
  });

  min: number = 0;
  max: number = 10000;

  updateRange(){

    var pass = true;

    if(this.filterForm.value.minControl === null || this.filterForm.value.minControl === null){
      alert("You must enter a number for both Maximum and Minimum");
      pass = false;
    }
    if(this.filterForm.value.minControl >= this.filterForm.value.maxControl){
      alert("Please enter a Minimum value which is smaller than the Maximum value");
      pass = false;
    }
    if(this.filterForm.value.minControl < 0 || this.filterForm.value.maxControl < 0){
      alert("Please don't use negative numbers");
      pass = false;
    }
    if(pass){

      this.min = this.filterForm.value.minControl;
      this.max = this.filterForm.value.maxControl;

      this.createList();
    }
    console.log("min: " +this.filterForm.value.minControl);
    console.log("max: " +this.filterForm.value.maxControl);
  }
  
  createList(){
    this.items$ = [];
    
    this.service.getItems().subscribe(res => {
      
      this.items$ = res.result.hits;
      var tempList = [];

      this.items$.forEach(element => {
        var hit;
        var correctUrl;

        element.parts.forEach(function(p){
          if(p.description.includes("RED")){
            correctUrl = p.primaryMedia.url; //find first part with "RED" in description
          }
        })
        
        if(this.min !== null && this.max !== null)
        if(element.partSummary.priceRanges.retail.start > this.min && element.partSummary.priceRanges.retail.end < this.max){
          if(element.partSummary.priceRanges.retail.start === element.partSummary.priceRanges.retail.end){
            hit = { id: element.publicId,
              name: element.name,
              img: "https://asset.lemansnet.com/"+ correctUrl +".png?x=176&y=176&b=&t=image/png",
              brand: element.brand.name,
              price: "$"+element.partSummary.priceRanges.retail.start,
              msrp: "MSRP",
            };
          }
          else{
            hit = { id: element.publicId,
              name: element.name,
              img: "https://asset.lemansnet.com/"+ correctUrl +".png?x=176&y=176&b=&t=image/png",
              brand: element.brand.name,
              price: "$"+element.partSummary.priceRanges.retail.start + " - " + "$"+element.partSummary.priceRanges.retail.end,
              msrp: "MSRP",
            };
          }
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

  ngOnInit() {

    this.createList();


  }
  

}
