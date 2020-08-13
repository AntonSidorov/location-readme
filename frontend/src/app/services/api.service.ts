import { Injectable } from '@angular/core';
import { ApolloQueryResult, FetchResult } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { Mutation, Query, Subscription } from '../graphql';
import { INote, INoteWithoutId, IUser } from '../models';
import { filterOutFalsy } from '../shared';

// To avoid copy/paste in this service - all the common actions that can be expected from
// making a GraphQL API call are done here.
// Actions: log error, map to the actual data, then make sure it's actually defined.
const extractApolloResult = <T>() => (obs: Observable<ApolloQueryResult<T> | FetchResult<T>>) =>
  obs.pipe(
    tap((v) => v.errors && console.warn(v.errors)),
    map((v) => v.data),
    filter(filterOutFalsy)
  );

// This service is pretty straight forward in what it does.
// The only bit that should be tested is the extractApolloResult function above
// Code coverage adds a function for each anonymous function, which in this service
// Is in every property to map to one property.

/* istanbul ignore next */
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private apollo: Apollo) {}

  // Subscriptions
  noteAdded$ = this.apollo
    .subscribe<{ noteAdded: INote }>({ query: Subscription.noteAdded })
    .pipe(
      extractApolloResult(),
      map((v) => v.noteAdded)
    );

  noteUpdated$ = this.apollo
    .subscribe<{ noteUpdated: INote }>({ query: Subscription.noteUpdated })
    .pipe(
      extractApolloResult(),
      map((v) => v.noteUpdated)
    );

  noteRemoved$ = this.apollo
    .subscribe<{ noteRemoved: string }>({ query: Subscription.noteRemoved })
    .pipe(
      extractApolloResult(),
      map((v) => v.noteRemoved)
    );

  // Queries
  notes$ = () =>
    this.apollo
      .query<{ notes: INote[] }>({ query: Query.notes })
      .pipe(
        extractApolloResult(),
        map((v) => v.notes)
      );

  // This will most likely not be used. Handling search locally in this scope is easier and can allow for live search updates too.
  searchNote$ = (variables: { query: string }) =>
    this.apollo
      .query<{ search: INote[] }>({ query: Query.search, variables })
      .pipe(
        extractApolloResult(),
        map((v) => v.search)
      );

  user$ = () =>
    this.apollo
      .query<{ user: IUser }>({ query: Query.user, fetchPolicy: 'no-cache' })
      .pipe(
        extractApolloResult(),
        map((v) => v.user)
      );

  // Mutations
  addNote$ = (variables: { note: INoteWithoutId }) =>
    this.apollo
      .mutate<{ addNote: INote }>({ mutation: Mutation.addNote, variables })
      .pipe(
        extractApolloResult(),
        map((v) => v.addNote)
      );

  updateNote$ = (variables: { note: INote }) =>
    this.apollo
      .mutate<{ updateNote: INote }>({ mutation: Mutation.updateNote, variables })
      .pipe(
        extractApolloResult(),
        map((v) => v.updateNote)
      );

  removeNote$ = (variables: { id: string }) =>
    this.apollo
      .mutate<{ removeNote: boolean }>({ mutation: Mutation.removeNote, variables })
      .pipe(
        extractApolloResult(),
        map((v) => v.removeNote)
      );

  updateNickname$ = (variables: { nickname: string }) =>
    this.apollo
      .mutate<{ updateNickname: boolean }>({ mutation: Mutation.updateNickname, variables })
      .pipe(
        extractApolloResult(),
        map((v) => v.updateNickname)
      );
}
