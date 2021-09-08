import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
 } from './styles';

export function Dashboard() {
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{uri: 'https://avatars.githubusercontent.com/u/32581187?v=4'}}/>
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Michel</UserName>
                        </User>
                    </UserInfo>
                </UserWrapper>
            </Header>
            <StatusBar style="auto" />
        </Container>
    )
}
