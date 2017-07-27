import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, Meta, Title } from '@angular/platform-browser'

import { BandData } from '../bandData'
import { WikiService } from '../../wiki.service'

@Component({
  selector: 'app-band-details',
  templateUrl: './band-details.component.html',
  styleUrls: ['./band-details.component.css']
})
export class BandDetailsComponent implements OnInit, OnDestroy {


  @Input() bandData: BandData;
  private videoUrl: SafeResourceUrl;
  private imgUrl: SafeResourceUrl;
  private altImg: string;
  private oldTags;

  constructor(private sanitizer: DomSanitizer, private wikiService: WikiService, private meta: Meta, private title: Title) {
    
    this.oldTags = [];
    this.oldTags.push(this.meta.getTag('name="description"'));
    this.oldTags.push(this.meta.getTag('name="keywords"'));
    this.oldTags.push(this.title.getTitle());

    // -- temp band info
    this.bandData = new BandData('Queen', '', '');
    this.bandData.videoId = '_Uu12zY01ts';
    this.bandData.imgUrl = 'http://i4.mirror.co.uk/incoming/article6736694.ece/ALTERNATES/s615b/Queen-rock-band-members-Freddie-Mercury-Brian-May-Roger-Taylor-Brian-Deacon.jpg'
    // End of temp band info

    this.title.setTitle(this.bandData.name.replace(/_/g, ' '));
  }

  ngOnInit() {


    console.warn(this.oldTags);

    this.altImg = `${this.bandData.name} image`;
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`http://www.youtube.com/embed/${this.bandData.videoId}?html5=1&amp;rel=0&amp;hl=es_ES&amp;version=3`)
    this.imgUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.bandData.imgUrl);

    this.wikiService.getData(this.bandData.name).subscribe(result => {
      let data = JSON.stringify(result.parse.text).split("<p>")[1].replace(/<\/?[^>]+(>|$)/g, "").split(".");
      const limpia = data.slice(0, data.length - 1).join(".");

      this.meta.removeTag('name="description"');
      this.meta.removeTag('name="keywords"');
      
      this.meta.addTags([{ name: 'description', content: limpia }, { name: 'keywords', content: `banda rock ${this.bandData.name.replace(/_/g, ' ')}` }]);
      
    },
      error => {
        console.error(error);
      });
  }
  ngOnDestroy(): void {
    this.oldTags.map(tag => {
      
      (typeof tag !== 'string') ? this.meta.addTag({name: tag.name,content: tag.content}) :this.title.setTitle(tag);
      debugger;
    })

  }

}
