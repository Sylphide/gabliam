// tslint:disable:one-line
// tslint:disable:no-unused-expression
import {
  Bean,
  Config,
  PluginConfig,
  register,
  Scan,
  Service,
  Value,
  Plugin,
  Init,
  InjectContainer,
  BeforeCreate,
  preDestroy
} from '../src/decorators';
import { CoreConfig } from '../src/decorators/config';
import { METADATA_KEY, TYPE } from '../src/constants';
import {
  BeanMetadata,
  RegistryMetada,
  ValueMetadata,
  PluginMetadata
} from '../src/interfaces';
import * as Joi from 'joi';
import { OnMissingBean } from '../src/index';

describe('@init', () => {
  test('should add init metadata to a class when decorating a method with @init', () => {
    @Config()
    class TestBean {
      @Init()
      testMethod() {}

      @Init()
      test2Method() {}
    }

    const initMetadata: string[] = Reflect.getMetadata(
      METADATA_KEY.init,
      TestBean
    );

    expect(initMetadata).toMatchSnapshot();
  });
});

describe('@BeforeCreate', () => {
  test('should add BeforeCreate metadata to a class when decorating a method with @BeforeCreate', () => {
    @Config()
    class TestBean {
      @BeforeCreate()
      testMethod() {}

      @BeforeCreate()
      test2Method() {}
    }

    const beforeCreateMetadata: string[] = Reflect.getMetadata(
      METADATA_KEY.beforeCreate,
      TestBean
    );

    expect(beforeCreateMetadata).toMatchSnapshot();
  });
});

describe('@InjectContainer', () => {
  test('should add InjectContainer metadata to a class when decorating a method with @InjectContainer', () => {
    @InjectContainer()
    @Config()
    class TestBean {}

    const injectMetadata = Reflect.hasMetadata(
      METADATA_KEY.injectContainer,
      TestBean
    );

    expect(injectMetadata).toMatchSnapshot();
  });
});

describe('@Bean', () => {
  test('should add Bean metadata to a class when decorated with @Bean', () => {
    class TestBean {
      @Bean('test')
      testMethod() {}

      @Bean('test2')
      test2Method() {}
    }

    const beanMetadata: BeanMetadata[] = Reflect.getMetadata(
      METADATA_KEY.bean,
      TestBean
    );

    expect(beanMetadata).toMatchSnapshot();
  });

  test('should add Bean metadata to a class when decorated multiple times with @Bean', () => {
    class TestBean {
      @Bean('test')
      testMethod() {}

      @Bean('test2')
      @Bean('test3')
      test2Method() {}
    }

    const beanMetadata: BeanMetadata[] = Reflect.getMetadata(
      METADATA_KEY.bean,
      TestBean
    );
    expect(beanMetadata).toMatchSnapshot();
  });
}); // end describe @Bean

describe('@OnMissingBean', () => {
  test('should add OnMissingBean metadata to a class when decorated with @OnMissingBean', () => {
    class TestBean {
      @OnMissingBean('OnMissingBean')
      @Bean('test')
      testMethod() {}

      @OnMissingBean('OnMissingBean2')
      @Bean('test2')
      test2Method() {}
    }

    const beanMetadata: BeanMetadata[] = Reflect.getMetadata(
      METADATA_KEY.bean,
      TestBean
    );

    expect(beanMetadata).toMatchSnapshot();
  });

  test('should add OnMissingBean metadata to a class when decorated multiple times with @OnMissingBean', () => {
    class TestBean {
      @OnMissingBean('OnMissingBean')
      @Bean('test')
      testMethod() {}

      @OnMissingBean('OnMissingBean1')
      @OnMissingBean('OnMissingBean2')
      @Bean('test2')
      @Bean('test3')
      test2Method() {}
    }

    const beanMetadata: BeanMetadata[] = Reflect.getMetadata(
      METADATA_KEY.bean,
      TestBean
    );
    expect(beanMetadata).toMatchSnapshot();
  });
}); // end describe @Bean

describe('@Config', () => {
  test('should add Registry and config metadata to a class when decorated with @Config', () => {
    @Config()
    class TestBean {}

    const registryMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.register,
      TestBean
    );

    const configMetadata: boolean | undefined = Reflect.getMetadata(
      METADATA_KEY.config,
      TestBean
    );

    expect(configMetadata).toMatchSnapshot();
    expect(registryMetadata).toMatchSnapshot();
  });

  test('should add Registry and config metadata to a class when decorated with @Config(100)', () => {
    @Config(100)
    class TestBean {}

    const registryMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.register,
      TestBean
    );

    const configMetadata: boolean | undefined = Reflect.getMetadata(
      METADATA_KEY.config,
      TestBean
    );

    expect(configMetadata).toMatchSnapshot();
    expect(registryMetadata).toMatchSnapshot();
  });

  test('should fail when decorated multiple times with @Config', () => {
    expect(function() {
      @Config()
      @Config()
      class TestBean {}

      new TestBean();
    }).toThrowError();
  });
}); // end describe @Config

describe('@PluginConfig', () => {
  test('should add Registry and config metadata to a class when decorated with @PluginConfig', () => {
    @PluginConfig()
    class TestBean {}

    const registryMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.register,
      TestBean
    );

    const configMetadata: boolean | undefined = Reflect.getMetadata(
      METADATA_KEY.config,
      TestBean
    );

    expect(configMetadata).toMatchSnapshot();
    expect(registryMetadata).toMatchSnapshot();
  });

  test('should add Registry and config metadata to a class when decorated with @PluginConfig(100)', () => {
    @PluginConfig(100)
    class TestBean {}

    const registryMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.register,
      TestBean
    );

    const configMetadata: boolean | undefined = Reflect.getMetadata(
      METADATA_KEY.config,
      TestBean
    );

    expect(configMetadata).toMatchSnapshot();
    expect(registryMetadata).toMatchSnapshot();
  });

  test('should fail when decorated multiple times with @Config', () => {
    expect(function() {
      @PluginConfig()
      @PluginConfig()
      class TestBean {}

      new TestBean();
    }).toThrowError();
  });
}); // end describe @Config

describe('@CoreConfig', () => {
  test('should add Registry and config metadata to a class when decorated with @CoreConfig', () => {
    @CoreConfig()
    class TestBean {}

    const registryMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.register,
      TestBean
    );

    const configMetadata: boolean | undefined = Reflect.getMetadata(
      METADATA_KEY.config,
      TestBean
    );

    expect(configMetadata).toMatchSnapshot();
    expect(registryMetadata).toMatchSnapshot();
  });

  test('should add Registry and config metadata to a class when decorated with @CoreConfig(100)', () => {
    @CoreConfig(100)
    class TestBean {}

    const registryMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.register,
      TestBean
    );

    const configMetadata: boolean | undefined = Reflect.getMetadata(
      METADATA_KEY.config,
      TestBean
    );

    expect(configMetadata).toMatchSnapshot();
    expect(registryMetadata).toMatchSnapshot();
  });

  test('should fail when decorated multiple times with @CoreConfig', () => {
    expect(function() {
      @CoreConfig()
      @CoreConfig()
      class TestBean {}

      new TestBean();
    }).toThrowError();
  });
}); // end describe @Config

describe('@Register', () => {
  test('should add Registry metadata to a class when decorated with @Register', () => {
    @register(TYPE.Config, { id: TestBean, target: TestBean })
    class TestBean {}

    const registryMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.register,
      TestBean
    );

    expect(registryMetadata).toMatchSnapshot();
  });
}); // end describe @Register

describe('@Scan', () => {
  test('should add Scan metadata to a class when decorated with @Scan()', () => {
    @Scan()
    class TestBean {}

    const scanMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.scan,
      TestBean
    );

    expect(scanMetadata).toMatchSnapshot();
  });

  test('should add Scan metadata to a class when decorated with @Scan(relativePath)', () => {
    @Scan('./fixtures/loader')
    class TestBean {}

    const scanMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.scan,
      TestBean
    );

    expect(scanMetadata).toMatchSnapshot();
  });

  test('should add Scan metadata to a class when decorated with @Scan(relativePath) 2', () => {
    @Scan('../src')
    class TestBean {}

    const scanMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.scan,
      TestBean
    );

    expect(scanMetadata).toMatchSnapshot();
  });

  test('should add Scan metadata to a class when decorated with @Scan(__dirname)', () => {
    @Scan(__dirname)
    class TestBean {}

    const scanMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.scan,
      TestBean
    );

    expect(scanMetadata).toMatchSnapshot();
  });

  test('should add Scan metadata to a class when decorated multiple times with @Scan', () => {
    @Scan(__dirname)
    @Scan(`${__dirname}/otherFolder`)
    class TestBean {}

    const scanMetadata: string[] = Reflect.getMetadata(
      METADATA_KEY.scan,
      TestBean
    );
    expect(scanMetadata).toMatchSnapshot();
  });
}); // end describe @Scan

describe('@Service', () => {
  test('should add Service metadata to a class when decorated with @Service', () => {
    @Service()
    class TestBean {}

    const registryMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.register,
      TestBean
    );

    const serviceMetadata: boolean | undefined = Reflect.getMetadata(
      METADATA_KEY.service,
      TestBean
    );
    expect(serviceMetadata).toMatchSnapshot();
    expect(registryMetadata).toMatchSnapshot();
  });

  test(`should add Service metadata to a class when decorated with @Service('Test)`, () => {
    @Service('Test')
    class TestBean {}

    const registryMetadata: RegistryMetada = Reflect.getMetadata(
      METADATA_KEY.register,
      TestBean
    );

    const serviceMetadata: boolean = Reflect.getMetadata(
      METADATA_KEY.service,
      TestBean
    );

    expect(serviceMetadata).toMatchSnapshot();
    expect(registryMetadata).toMatchSnapshot();
  });
}); // end describe @Service

describe('@Value', () => {
  describe('@Value(options: ValueOptions)', () => {
    test('should add Value metadata to a class when decorated with @Value(options: ValueOptions)', () => {
      class TestBean {
        @Value({ path: 'application.name' })
        name: string;
        @Value({ path: 'application.surname', validator: Joi.string() })
        surname: string;
        @Value({
          path: 'application.surname',
          validator: { schema: Joi.string() }
        })
        firstname: string;
        @Value({
          path: 'application.postalcode',
          validator: {
            schema: Joi.string().required(),
            customErrorMsg: 'Error'
          }
        })
        postalcode: string;
        @Value({
          path: 'application.address',
          validator: Joi.string().required()
        })
        address: string;
      }

      const valueMetadata: ValueMetadata[] = Reflect.getMetadata(
        METADATA_KEY.value,
        TestBean
      );
      expect(valueMetadata).toMatchSnapshot();
    });
  }); // end @Value(options: ValueOptions)

  test('should fail whit bad value', () => {
    expect(function() {
      class TestBean {
        @Value(<any>{ lol: 'application.name' })
        name: string;
      }

      new TestBean();
    }).toThrowError();
  });
}); // end describe @Value

describe('@Plugin', () => {
  test('should add Plugin metadata to a class when decorated with @Plugin()', () => {
    @Plugin()
    class TestBean {}
    const pluginMetadata: PluginMetadata = Reflect.getMetadata(
      METADATA_KEY.plugin,
      TestBean
    );
    expect(pluginMetadata).toMatchSnapshot();
  });

  test(`should add Plugin metadata to a class when decorated with @Plugin('TestPlugin')`, () => {
    @Plugin('TestPlugin')
    class TestBean {}
    const pluginMetadata: PluginMetadata = Reflect.getMetadata(
      METADATA_KEY.plugin,
      TestBean
    );
    expect(pluginMetadata).toMatchSnapshot();
  });

  test(`should add Plugin metadata to a class when decorated with @Plugin({ dependencies: ['TestPlugin'] })`, () => {
    @Plugin({ dependencies: ['TestPlugin'] })
    class TestBean {}
    const pluginMetadata: PluginMetadata = Reflect.getMetadata(
      METADATA_KEY.plugin,
      TestBean
    );
    expect(pluginMetadata).toMatchSnapshot();
  });

  test(`should add Plugin metadata to a class when decorated with @Plugin({ name: 'TestPlugin' })`, () => {
    @Plugin({ name: 'TestPlugin' })
    class TestBean {}
    const pluginMetadata: PluginMetadata = Reflect.getMetadata(
      METADATA_KEY.plugin,
      TestBean
    );
    expect(pluginMetadata).toMatchSnapshot();
  });

  test(`should add Plugin metadata to a class when decorated with @Plugin({ name: 'TestPlugin', dependencies: ['TestPlugin2'] })`, () => {
    @Plugin({ name: 'TestPlugin', dependencies: ['TestPlugin2'] })
    class TestBean {}
    const pluginMetadata: PluginMetadata = Reflect.getMetadata(
      METADATA_KEY.plugin,
      TestBean
    );
    expect(pluginMetadata).toMatchSnapshot();
  });

  test('should fail when decorated multiple times with @Plugin', () => {
    expect(function() {
      @Plugin()
      @Plugin()
      class TestBean {}

      new TestBean();
    }).toThrowError();
  });

  test('should fail whit bad value', () => {
    expect(function() {
      @Plugin(<any>{ lol: 'application.name' })
      class TestBean {}

      new TestBean();
    }).toThrowError();
  });
});

describe('@preDestroy', () => {
  test('should add preDestroy metadata to a class when decorated with @preDestroy', () => {
    class TestBean {
      @preDestroy()
      preDestroy() {}

      @preDestroy()
      preDestroy2() {}
    }
    const pluginMetadata: PluginMetadata = Reflect.getMetadata(
      METADATA_KEY.preDestroy,
      TestBean
    );
    expect(pluginMetadata).toMatchSnapshot();
  });
});
