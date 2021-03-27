import React, {
  useState,
  useEffect,
} from 'react';
import { usePrevious } from '@src/core/utils/hookHelper';
import {
  View,
  ViewProps,
} from 'react-native';
import {
  Hr,
  SelectedInputV1,
} from '@src/components';
import { PatientSortFormData } from '@src/core/models/filterAndSort/filterAndSort';
import { SortFieldEnum } from '@src/core/utils/constants';

// interface ComponentProps {
//   initialSortFormData: PatientSortFormData;
//   onSortFormDataChange: (value: PatientSortFormData | undefined) => void;
// }

// export type PatientSortFormProps = ThemedComponentProps & ViewProps & ComponentProps; 

const SortProject = (props) => {
  const [sortFormData, setSortFormData] = useState();

  const onSelectInputChange = (sortField) => {
    setSortFormData({ sortField });
  };

  const { style, ...restProps } = props;

  return (
    <View
      style={[
        themedStyle.container,
        style,
      ]}
      {...restProps}>
      <SelectedInputV1
        title={I18n.t('patient.phdLastUpdate')}
        selected={sortFormData.sortField === SortFieldEnum.LastUpdate}
        onInputPress={() => {
          onSelectInputChange(SortFieldEnum.LastUpdate);
        }}
      />
      <Hr />
      <SelectedInputV1
        title={I18n.t('patient.phdPatientLastName')}
        selected={sortFormData.sortField === SortFieldEnum.LastName}
        onInputPress={() => {
          onSelectInputChange(SortFieldEnum.LastName);
        }}
      />
      <Hr />
    </View>
  );
};

