import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from './post.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'simple-pagination';

  loading = true;

  posts: Post[];
  currentPage = 1;
  postsPerPage = 10;

  // Get Current Post
  currentPosts$: Observable<Post[]>;
  pageNumbers$: Observable<number[]>;
  indexOfLastPost: number;
  indexOfFirstPost: number;
  totalPosts: number;
  totalPages: number;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.currentPosts$ = this.appService.getPosts()
      .pipe(map(data => {
        this.loading = false;
        this.posts = data;

        const currentPosts = this.setCurrentPost(this.currentPage);
        this.totalPosts = this.posts.length;

        // Get Page Numbers
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(this.totalPosts / this.postsPerPage); i++) {
          pageNumbers.push(i);
        }
        this.pageNumbers$ = of(pageNumbers);
        this.totalPages = pageNumbers.length;

        return currentPosts;
      }));
  }

  paginate(pageNumber: number): void {
    this.currentPosts$ = of(this.setCurrentPost(pageNumber));
  }

  setCurrentPost(pageNumber: number): Post[] {
    this.currentPage = pageNumber;
    this.indexOfLastPost = this.currentPage * this.postsPerPage;
    this.indexOfFirstPost = this.indexOfLastPost - this.postsPerPage;

    return this.posts.slice(this.indexOfFirstPost, this.indexOfLastPost);
  }

  previous(): void {
    this.currentPage -= 1;
    if (this.currentPage >= 1) {
      this.currentPosts$ = of(this.setCurrentPost(this.currentPage));
    }
  }

  next(): void {
    this.currentPage += 1;
    if (this.currentPage <= this.totalPages) {
      this.currentPosts$ = of(this.setCurrentPost(this.currentPage));
    }
  }

  activeDisableCurrentLink(currentPage: number): boolean {
    return this.currentPage === currentPage;
  }

  disablePrevious(): boolean {
    return this.currentPage <= 1;
  }

  disableNext(): boolean {
    return this.currentPage >= this.totalPages;
  }

  trackByFn(index: any, item: any): number {
    return index;
  }
}
