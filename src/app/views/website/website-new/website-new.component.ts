import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Website} from '../../../models/website.model.client';
import {WebsiteService} from '../../../services/website.service.client';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-website-new',
  templateUrl: './website-new.component.html',
  styleUrls: ['./website-new.component.css']
})
export class WebsiteNewComponent implements OnInit {
  @ViewChild('f') webForm: NgForm;

  userId: String;
  websites: Website[] = [];
  website: Website;

  constructor(private websiteService: WebsiteService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      console.log(params['uid']);
      this.userId = params['uid'];
    });
    this.websites = this.websiteService.findWebsitesByUser2(this.userId);
    this.website = WebsiteService.getNewWebsite();
  }

  createWebsite() {
    this.website.name = this.webForm.value.name;
    this.websiteService.createWebsite(this.userId, this.website);
  }
}
