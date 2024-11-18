<script>
import { HelloRequest } from './generated/hello';
import { GreetingServiceClient } from './generated/hello.client';
import {GrpcWebFetchTransport} from "@protobuf-ts/grpcweb-transport";

const client = new GreetingServiceClient(
    new GrpcWebFetchTransport({
      baseUrl: 'http://localhost:9000'
    })
);

client.hello({name: 'en'}).then(response => {
  console.log(response);
});

</script>

<template>
  <div>
    <p>1 man en</p>
  </div>
</template>