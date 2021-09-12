import React, { useState } from 'react';
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert, 
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes,
} from './styles';
import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string()
        .required('Inform a Name'),
    amount: Yup.number()
        .typeError('Inform a valid amount')
        .positive('Inform a positive amount')
        .required('Inform an Amount'),
});

export function Register() {
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Category',
    });

    const { 
            control, 
            handleSubmit,
            formState: { errors },
        } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect (type: 'up'| 'down') {
        setTransactionType(type);
    }
    
    function handleOpenCategoryModal () {
        setCategoryModalOpen(true);
    }

    function handleCloseCategoryModal () {
        setCategoryModalOpen(false);
    }
   
    function handleRegister (form: FormData) {
        if (!transactionType) 
            return Alert.alert('Select a Transaction Type');
        
        if (category.key === 'category') 
            return Alert.alert('Select a Category');

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
        };
        console.log(data);
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <Container>
                <Header>
                    <Title>Register</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control} 
                            placeholder="Name" 
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />

                        <InputForm
                            name="amount"
                            control={control} 
                            placeholder="Price" 
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />
                        <TransactionTypes>
                            <TransactionTypeButton
                                isActive={transactionType === 'up'} 
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionTypeSelect('up')}
                            />
                            <TransactionTypeButton
                                isActive={transactionType === 'down'} 
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionTypeSelect('down')}
                            />
                        </TransactionTypes>
                        
                        <CategorySelectButton 
                            title={category.name} 
                            onPress={handleOpenCategoryModal}
                        />

                    </Fields>

                    <Button 
                        title="Send" 
                        onPress={handleSubmit(handleRegister)}
                    />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>

    )
};