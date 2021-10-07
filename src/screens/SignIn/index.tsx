import React from 'react'
import { 
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from './styles';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';


export function SignIn() {
    const { user } = useAuth();
    console.log(user);
    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg 
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                </TitleWrapper>

                <Title>
                    Control {'\n'} all your finances {'\n'} way easier
                </Title>

                <SignInTitle>
                    Sign in with {'\n'} one of the following services
                </SignInTitle>
            </Header>
            <Footer>
                <FooterWrapper>
                    <SignInSocialButton 
                        title="Sign in with Google"
                        svg={GoogleSvg}
                    />
                    <SignInSocialButton 
                        title="Sign in with Apple"
                        svg={AppleSvg}
                    />
                </FooterWrapper>
            </Footer>
        </Container>
    )
}
