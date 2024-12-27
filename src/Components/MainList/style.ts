import styled from "styled-components";

export const MainListWrapper = styled.div`
	.surveys {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 12px;
	}
`;

export const SurveyItemWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	border: 1px solid gray;
	padding: 12px;
	border-radius: 12px;
	box-shadow: 0px 2px 4px 1px rgba(34, 60, 80, 0.4);
`;
