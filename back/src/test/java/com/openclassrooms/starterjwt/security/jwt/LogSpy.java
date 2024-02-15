package com.openclassrooms.starterjwt.security.jwt;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.util.function.Predicate;

import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.ParameterContext;
import org.junit.jupiter.api.extension.ParameterResolutionException;
import org.junit.jupiter.api.extension.ParameterResolver;
import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;

public final class LogSpy implements BeforeEachCallback, AfterEachCallback, ParameterResolver {
    private Logger logger;
    private ListAppender<ILoggingEvent> appender;

    @Override
    public void beforeEach(ExtensionContext context) throws Exception {
        appender = new ListAppender<>();
        logger = (Logger) LoggerFactory.getLogger("com.openclassrooms.starterjwt");
        logger.addAppender(appender);
        logger.setLevel(Level.TRACE);
        appender.start();
    }

    @Override
    public void afterEach(ExtensionContext context) throws Exception {
        logger.detachAppender(appender);
    }

    public void assertLogged(Level level, String content) {
        assertThat(appender.list.stream().anyMatch(withLog(level, content))).isTrue();
    }

    public void assertLogged(Level level, String content, int count) {
        assertThat(appender.list.stream().filter(withLog(level, content)).count()).isEqualTo(count);
    }

    public void assertNotLogged(Level level, String content) {
        assertThat(appender.list.stream().noneMatch(withLog(level, content))).isTrue();
    }

    private Predicate<ILoggingEvent> withLog(Level level, String content) {
        return event -> level.equals(event.getLevel()) && event.toString().contains(content);
    }

    @Override
    public boolean supportsParameter(ParameterContext parameterContext, ExtensionContext extensionContext)
            throws ParameterResolutionException {
        return parameterContext.getParameter().getType().equals(LogSpy.class);
    }

    @Override
    public LogSpy resolveParameter(ParameterContext parameterContext, ExtensionContext extensionContext)
            throws ParameterResolutionException {
        return this;
    }
}
