import React, { useState, useContext, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Card, Input, Button, Overlay } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { styles, colors } from '../styles/styles';
import { Context as MessageContext } from '../context/MessageContext';
import useAuthInfo from '../hooks/useAuthInfo';
import { TouchableOpacity } from 'react-native-gesture-handler';

const InfoScreen = props => {
	const [msg, setMsg] = useState('');
	const [email, setEmail] = useState('');
	const [isVisible1, setisVisible1] = useState(false);
	const [isVisible2, setisVisible2] = useState(false);
	const [isVisible3, setisVisible3] = useState(false);
	const [isVisible4, setisVisible4] = useState(false);
	const [isVisible5, setisVisible5] = useState(false);
	const [isVisible6, setisVisible6] = useState(false);
	const { state, sendToRoylen, cleanUpMessage } = useContext(MessageContext);

	useFocusEffect(
		useCallback(() => {
			//do something when screen is focused...
			return () => {
				//when unfocusing
				cleanUpMessage();
			};
		}, [])
	);

	const user = useAuthInfo();

	const closeForm = () => {
		setMsg('');
		setEmail('');
	};
	const sendMsg = () => {
		const ident = email ? email : user.email ? user.email : '';
		sendToRoylen(msg, ident);
		closeForm();
	};
	return (
		<ScrollView style={styles.container}>
			<View style={styles.contentContainer}>
				<Text h4>Welcome to Roylen</Text>
				<View style={styles.cardContainer}>
					<Card title="Contact us">
						{state.message ? <Text>{state.message}</Text> : null}
						{state.errorMessage ? (
							<Text style={styles.errorMessage}>{state.errorMessage}</Text>
						) : null}
						{!user ? (
							<Input
								title="Your email address"
								placeholder="Not required"
								value={email}
								onChangeText={setEmail}
							/>
						) : null}
						<Input
							title="Your message"
							placeholder="Type your message to us"
							multiline
							value={msg}
							onChangeText={setMsg}
						/>
						<View style={styles.buttonRow}>
							<Button
								title="Cancel"
								onPress={closeForm}
								buttonStyle={{
									...styles.Button.buttonStyle,
									backgroundColor: colors.accentedColor
								}}
								titleStyle={{
									...styles.Button.titleStyle,
									color: colors.color
								}}
								containerStyle={{
									...styles.Button.containerStyle,
									flex: 1
								}}
							/>
							<Button
								title="Send"
								onPress={sendMsg}
								buttonStyle={{ ...styles.Button.buttonStyle }}
								containerStyle={{
									...styles.Button.containerStyle,
									flex: 2,
									marginLeft: 10
								}}
							/>
						</View>
					</Card>

					<View style={styles.cardContainer}>
						<Card title="More information" containerStyle={{ width: '80%' }}>
							<TouchableOpacity onPress={() => setisVisible1(true)}>
								<Text style={{ textDecorationLine: 'underline' }}>
									Over deze app
								</Text>
							</TouchableOpacity>
							<Overlay
								isVisible={isVisible1}
								onBackdropPress={() => setisVisible1(false)}
								borderRadius={15}
							>
								<>
									<Text>
										Gemaakt uit liefde voor de planeet en zijn inwoners, in het
										bijzonder voor alle jonge ouders die zich vertwijfeld
										afvragen of hun kind elke drie maanden nieuwe kleren en
										nieuw speelgoed nodig blijft hebben. Voor altijd gratis in
										het basisgebruik, met volledige garantie op privacy van jou,
										als eindgebruiker. (zie ons privacystatement). Niet bedoeld
										om zoveel mogelijk clicks te genereren of je zo lang
										mogelijk in deze app te houden, maar om je leven net een
										klein beetje eenvoudiger te maken, je wat geld te besparen,
										en in de tussentijd ook nog iets goeds te doen voor de
										planeet. Ben je er blij mee? Spread the word. Je kunt ook
										een review achterlaten in de App Store. En als je op of
										aanmerkingen hebt? Gebruik het contactformulier hierboven.
									</Text>
									<Button title="Close" onPress={() => setisVisible1(false)} />
								</>
							</Overlay>
							<TouchableOpacity onPress={() => setisVisible6(true)}>
								<Text style={{ textDecorationLine: 'underline' }}>
									Wat is Roylen? En nix? Hoezo nix?
								</Text>
							</TouchableOpacity>
							<Overlay
								isVisible={isVisible6}
								onBackdropPress={() => setisVisible6(false)}
								borderRadius={15}
								height={400}
							>
								<>
									<Text>
										Nix zijn de interne munteenheid van Roylen. Als je je
										inschrijft, krijg je 100 nix, zomaar, gratis en voor niks.
										Als je een product te ruilen aanbiedt, kun je er een waarde
										op plakken. Zo kun je meer nix verzamelen; en die kun je dan
										weer gebruiken om producten van anderen over te nemen. Zo
										kan de ruilwaarde van de dingen worden uitgedrukt in nix.
									</Text>

									<Button title="Close" onPress={() => setisVisible6(false)} />
								</>
							</Overlay>
							<TouchableOpacity onPress={() => setisVisible2(true)}>
								<Text style={{ textDecorationLine: 'underline' }}>
									Je privacy
								</Text>
							</TouchableOpacity>
							<Overlay
								isVisible={isVisible2}
								onBackdropPress={() => setisVisible2(false)}
								borderRadius={15}
							>
								<>
									<Text>
										Je locatie is alleen maar nodig om vast te leggen welke
										advertenties voor jou het meest van belang zijn. We filteren
										op afstand. Deze gegevens, en alle andere gegevens die we
										over jou verzamelen, worden enkel en alleen gebruikt om de
										app goed te laten functioneren. Wij hebben verder geen enkel
										financieel belang bij deze gegevens; je kunt de app anoniem
										gebruiken om door de advertenties te bladeren, maar als je
										wat van de andere functies wil proberen, moet je een account
										aanmaken. Dat kan anoniem; het enige wat je van je nodig
										hebben, is een email adres. Dat wordt verwijderd als je je
										account verwijdert, en wordt voor geen enkel ander doel
										gebruikt dan je af en toe te kunnen berichten als een andere
										gebruiker contact met je zoekt of als er belangrijke
										systeem-informatie is.
									</Text>

									<Button title="Close" onPress={() => setisVisible2(false)} />
								</>
							</Overlay>
							<TouchableOpacity onPress={() => setisVisible3(true)}>
								<Text style={{ textDecorationLine: 'underline' }}>
									Leveringsvoorwaarden
								</Text>
							</TouchableOpacity>
							<Overlay
								isVisible={isVisible3}
								onBackdropPress={() => setisVisible3(false)}
								borderRadius={15}
								height={350}
							>
								<>
									<Text>
										De app is zorgvuldig en en met liefde voor detail opgebouwd,
										maar het is en blijft mensenwerk. We kunnen niet garanderen
										dat er nooit of te nimmer een bug of fout optreedt. Daarom
										kun je geen rechten ontlenen aan deze app of de daarin
										gepresenteerde informatie. Door deze app te downloaden en te
										gebruiken accepteer je deze leveringsvoorwaarden.
									</Text>
									<Button title="Close" onPress={() => setisVisible3(false)} />
								</>
							</Overlay>
							<TouchableOpacity onPress={() => setisVisible4(true)}>
								<Text style={{ textDecorationLine: 'underline' }}>
									PublicSpaces
								</Text>
							</TouchableOpacity>
							<Overlay
								isVisible={isVisible4}
								onBackdropPress={() => setisVisible4(false)}
								borderRadius={15}
								height={350}
							>
								<>
									<Text>
										PublicSpaces is een organisatie die zich ten doel stelt om
										het publieke domein op het internet te versterken. Deze app
										is gemaakt met de waarborgen van PublicSpaces in het
										achterhoofd. Volledige transparantie is daarbij belangrijk.
										De broncode van deze app is daarom openbaar, en kun je hier
										downloaden en inzien.
									</Text>

									<Button title="Close" onPress={() => setisVisible4(false)} />
								</>
							</Overlay>

							<TouchableOpacity onPress={() => setisVisible5(true)}>
								<Text style={{ textDecorationLine: 'underline' }}>Credits</Text>
							</TouchableOpacity>
							<Overlay
								isVisible={isVisible5}
								onBackdropPress={() => setisVisible5(false)}
								borderRadius={15}
								height={450}
							>
								<>
									<Text>
										Design: Mirre Bogaerts{'\n'}Idea and development: GJ
										Bogaerts
										{'\n'}
										{'\n'}Using OS tools and libraries:{'\n'}React Native{'\n'}
										React Native Elements{'\n'}Ionicons{'\n'}React Navigation
										{'\n'}Expo{'\n'}Axios{'\n'}i-18{'\n'}Mongo
										{'\n'}Github{'\n'}Visual Studio Code
									</Text>
									<Button title="Close" onPress={() => setisVisible5(false)} />
								</>
							</Overlay>
						</Card>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default InfoScreen;
