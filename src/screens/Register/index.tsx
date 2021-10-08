import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    TouchableWithoutFeedback, 
    Keyboard,
    Alert, 
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useNavigation } from '@react-navigation/native';
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
import { useAuth } from '../../hooks/auth';

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
    const { user } = useAuth();
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [category, setCategory] = useState({
        key: 'category',
        name: 'Category',
    });

    const navigation = useNavigation();

    const dataKey = `@gofinances:transactions_user:${user.id}`;

    const { 
            control, 
            handleSubmit,
            reset,
            formState: { errors },
        } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect (type: 'positive'| 'negative') {
        setTransactionType(type);
    }
    
    function handleOpenCategoryModal () {
        setCategoryModalOpen(true);
    }

    function handleCloseCategoryModal () {
        setCategoryModalOpen(false);
    }
   
    async function handleRegister (form: FormData) {
        if (!transactionType) 
            return Alert.alert('Select a Transaction Type');
        
        if (category.key === 'category') 
            return Alert.alert('Select a Category');

        const newTransaction = {
            id: `${uuid.v4()}`,
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        };

        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];
            const dataFormatted = [...currentData, newTransaction];

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Category',
            });

            navigation.navigate('Dashboard');

        } catch (error) {
            console.log(error, 'error');
            Alert.alert('Error', 'An error occurred while registering');
        }
    }

    useEffect(() => {
        async function loadData () {
            const data = await AsyncStorage.getItem(dataKey);
            data && console.log(JSON.parse(data));
        }
        loadData();
        // async function removeAll () {
        //     await AsyncStorage.removeItem(dataKey);
        // }
        // removeAll();
    }, [])

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
                                isActive={transactionType === 'positive'} 
                                type="up"
                                title="Income"
                                onPress={() => handleTransactionTypeSelect('positive')}
                            />
                            <TransactionTypeButton
                                isActive={transactionType === 'negative'} 
                                type="down"
                                title="Outcome"
                                onPress={() => handleTransactionTypeSelect('negative')}
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