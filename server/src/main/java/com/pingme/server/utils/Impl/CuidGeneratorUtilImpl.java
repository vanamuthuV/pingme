package com.pingme.server.utils.Impl;

import com.pingme.server.utils.CuidGeneratorUtil;
import cool.graph.cuid.Cuid;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;

import java.io.Serializable;

public class CuidGeneratorUtilImpl implements CuidGeneratorUtil {
    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) throws HibernateException {
        return Cuid.createCuid();
    }
}
