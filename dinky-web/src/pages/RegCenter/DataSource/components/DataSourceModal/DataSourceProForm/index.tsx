/*
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import CodeEdit from '@/components/CustomEditor/CodeEdit';
import {
  AUTO_COMPLETE_TYPE,
  DATA_SOURCE_TYPE,
  DATA_SOURCE_TYPE_OPTIONS,
  GROUP_TYPE
} from '@/pages/RegCenter/DataSource/components/constants';
import { DataSources } from '@/types/RegCenter/data.d';
import { l } from '@/utils/intl';
import {
  ProForm,
  ProFormGroup,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-components';
import { AutoComplete, Form } from 'antd';
import { FormInstance } from 'antd/es/form/hooks/useForm';
import TextArea from 'antd/es/input/TextArea';
import { Values } from 'async-validator';
import React, { useState } from 'react';
import PaimonSourceForm from '@/pages/RegCenter/DataSource/components/DataSourceView/GeneralJdbc/PaimonSourceForm';
import JdbcSourceForm from '@/pages/RegCenter/DataSource/components/DataSourceView/GeneralJdbc/JdbcSourceForm';

type DataSourceProFormProps = {
  values: Partial<DataSources.DataSource>;
  form: FormInstance<Values>;
  dbType: string;
  excludeFormItem: boolean;
  flinkConfigChange: (value: string) => void;
  flinkTemplateChange: (value: string) => void;
};

const CodeEditProps = {
  height: '30vh',
  width: '22vw',
  lineNumbers: 'off',
  language: 'sql'
};

const DataSourceProForm: React.FC<DataSourceProFormProps> = (props) => {
  const { values, form, dbType, excludeFormItem, flinkTemplateChange, flinkConfigChange } = props;
  const [selectDbType, setSelectDbType] = useState<string>(dbType);

  const renderDataSourceForm = (type?: string) => {
    switch (type) {
      case DATA_SOURCE_TYPE.PAIMON:
        return <PaimonSourceForm form={form} />;
      default:
        return <JdbcSourceForm form={form} />;
    }
  };
  const renderForm = () => {
    return (
      <>
        <ProForm.Group>
          <ProFormText
            name='name'
            width={'md'}
            label={l('rc.ds.name')}
            rules={[{ required: true, message: l('rc.ds.namePlaceholder') }]}
            placeholder={l('rc.ds.namePlaceholder')}
          />
          <ProFormSelect
            name='groupName'
            width={'sm'}
            label={l('rc.ds.groupName')}
            options={GROUP_TYPE}
            placeholder={l('rc.ds.groupNamePlaceholder')}
          />
          <ProFormSelect
            name='type'
            width={'sm'}
            label={l('rc.ds.type')}
            showSearch
            onChange={(v: string) => setSelectDbType(v)}
            initialValue={dbType}
            options={DATA_SOURCE_TYPE_OPTIONS}
            rules={[{ required: true, message: l('rc.ds.typePlaceholder') }]}
            placeholder={l('rc.ds.typePlaceholder')}
          />
          {renderDataSourceForm(selectDbType)}
        </ProForm.Group>

        {!excludeFormItem && (
          <ProFormGroup>
            <ProForm.Item
              name='flinkConfig'
              label={l('rc.ds.flinkConfig')}
              tooltip={l('rc.ds.flinkConfigTooltip')}
            >
              <CodeEdit
                {...CodeEditProps}
                onChange={flinkConfigChange}
                code={values.flinkConfig || ''}
              />
            </ProForm.Item>

            <ProForm.Item
              name='flinkTemplate'
              label={l('rc.ds.flinkTemplate')}
              tooltip={l('rc.ds.flinkTemplateTooltip')}
            >
              <CodeEdit
                {...CodeEditProps}
                onChange={flinkTemplateChange}
                code={values.flinkTemplate || ''}
              />
            </ProForm.Item>
          </ProFormGroup>
        )}
        <ProFormText
          name='note'
          label={l('global.table.note')}
          placeholder={l('global.table.notePlaceholder')}
        />
      </>
    );
  };

  return renderForm();
};
export default DataSourceProForm;
