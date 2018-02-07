#!/bin/bash

topo2geo \
  < data/topo.json \
  blockgroups=data/ri.json \
  towns=data/ri_towns.json
