import {Inject, ModuleWithProviders, NgModule} from '@angular/core';
import {ApolloClientOptions, DefaultOptions, gql, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {APOLLO_OPTIONS} from 'apollo-angular';
import {API_URLS, Endpoints} from './types';
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore'
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  }
};
@NgModule({})
export class GraphQLModule {
  public static forRoot(): ModuleWithProviders<GraphQLModule> {
    return {
      ngModule: GraphQLModule,
      providers: [
        {
          provide: APOLLO_OPTIONS,
          useFactory: (httpLink: HttpLink, configuration: Endpoints): ApolloClientOptions => {
            const variantGraphQL = configuration.variantApiUrl;

            return {
              link: httpLink.create({
                uri: variantGraphQL ? `${variantGraphQL}/graphql` : '/covid19-api/graphql'
              }),
              cache: new InMemoryCache(),
              defaultOptions
            };
          },
          deps: [HttpLink, API_URLS]
        }
      ]
    };
  }
}
