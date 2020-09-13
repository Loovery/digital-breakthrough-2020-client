import React, {useState} from 'react';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import {TextInput} from 'react-native';

interface Props {
  isVisible: boolean;
  onSave: Function;
  onDelete: Function;
  onClose: Function;
}

export default function (props: Props) {
  const [name, setName] = useState('');
  const {isVisible} = props;

  return (
    <ConfirmDialog
      title="Введите имя видео"
      visible={isVisible}
      onTouchOutside={() => {
        setName('');
        props.onClose()
      }}
      negativeButton={{
        title: 'Удалить',
        onPress: () => {
          setName('');
          props.onDelete();
        },
      }}
      positiveButton={{
        title: 'Сохранить',
        onPress: () => {
          props.onSave(name);
          setName('');
        },
      }}>
      <TextInput
        placeholderTextColor={'#aaa'}
        placeholder={'Имя'}
        style={{fontSize: 18}}
        onChangeText={setName}
        value={name}
      />
    </ConfirmDialog>
  );
}
