package com.pingme.server.mappers;

public interface Mapper <A, B>{

    A mapTo (B b);
    B mapFrom (A a);

}
