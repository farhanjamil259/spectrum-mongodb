// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import editCommunityMutation from 'shared/graphql/mutations/community/editCommunity';
import deleteCommunityMutation from 'shared/graphql/mutations/community/deleteCommunity';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import { addToastWithTimeout } from 'src/actions/toasts';
import { Button } from 'src/components/button';
import { Notice } from 'src/components/listItems/style';
import {
  Input,
  UnderlineInput,
  TextArea,
  PhotoInput,
  CoverInput,
  Error,
} from 'src/components/formElements';
import { ImageInputWrapper } from 'src/components/editForm/style';
import { Actions, FormContainer, Form } from '../../style';
import type { Dispatch } from 'redux';

type State = {
  name: string,
  slug: string,
  description: string,
  communityId: string,
  website: string,
  image: string,
  coverPhoto: string,
  file: ?Object,
  coverFile: ?Object,
  communityData: Object,
  photoSizeError: boolean,
  nameError: boolean,
  isLoading: boolean,
};

type Props = {
  community: GetCommunityType,
  dispatch: Dispatch<Object>,
  communityUpdated: Function,
  editCommunity: Function,
};

class CommunityWithData extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { community } = this.props;
    this.state = {
      name: community.name,
      slug: community.slug,
      description: community.description ? community.description : '',
      communityId: community.id,
      website: community.website ? community.website : '',
      image: community.profilePhoto,
      coverPhoto: community.coverPhoto,
      file: null,
      coverFile: null,
      communityData: community,
      photoSizeError: false,
      nameError: false,
      isLoading: false,
    };
  }

  changeName = e => {
    const name = e.target.value;

    if (name.length > 20) {
      this.setState({
        name,
        nameError: true,
      });

      return;
    }

    this.setState({
      name,
      nameError: false,
    });
  };

  changeDescription = e => {
    const description = e.target.value;
    this.setState({
      description,
    });
  };

  changeSlug = e => {
    const slug = e.target.value;
    this.setState({
      slug,
    });
  };

  changeWebsite = e => {
    const website = e.target.value;
    this.setState({
      website,
    });
  };

  setCommunityPhoto = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    if (!file) return;

    this.setState({
      isLoading: true,
    });

    if (file && file.size > 3000000) {
      return this.setState({
        photoSizeError: true,
        isLoading: false,
      });
    }

    reader.onloadend = () => {
      this.setState({
        file: file,
        // $FlowFixMe
        image: reader.result,
        photoSizeError: false,
        isLoading: false,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  setCommunityCover = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    if (!file) return;

    this.setState({
      isLoading: true,
    });

    if (file && file.size > 3000000) {
      return this.setState({
        photoSizeError: true,
        isLoading: false,
      });
    }

    reader.onloadend = () => {
      this.setState({
        coverFile: file,
        // $FlowFixMe
        coverPhoto: reader.result,
        photoSizeError: false,
        isLoading: false,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  save = e => {
    e.preventDefault();
    const {
      name,
      description,
      website,
      file,
      coverFile,
      communityId,
      photoSizeError,
    } = this.state;
    const input = {
      name,
      description,
      website,
      file,
      coverFile,
      communityId,
    };

    if (photoSizeError) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    this.props
      .editCommunity(input)
      .then(({ data: { editCommunity } }) => {
        const community = editCommunity;

        this.setState({
          isLoading: false,
        });

        // community was returned
        if (community !== undefined) {
          this.props.dispatch(
            addToastWithTimeout('success', 'Community saved!')
          );
          this.props.communityUpdated(community);
        }
        return;
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        this.props.dispatch(
          addToastWithTimeout(
            'error',
            `Something went wrong and we weren't able to save these changes. ${err}`
          )
        );
      });
  };

  render() {
    const {
      name,
      slug,
      description,
      image,
      coverPhoto,
      website,
      photoSizeError,
      nameError,
      isLoading,
    } = this.state;

    return (
      <FormContainer>
        <Form onSubmit={this.save}>
          <ImageInputWrapper>
            <CoverInput
              onChange={this.setCommunityCover}
              defaultValue={coverPhoto}
              preview={true}
              allowGif
            />

            <PhotoInput
              type={'community'}
              onChange={this.setCommunityPhoto}
              defaultValue={image}
            />
          </ImageInputWrapper>

          <Input defaultValue={name} onChange={this.changeName}>
            Name
          </Input>
          <UnderlineInput defaultValue={slug} disabled>
            spectrum.chat/
          </UnderlineInput>

          {nameError && (
            <Error>Community names can be up to 20 characters long.</Error>
          )}

          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
          >
            Description
          </TextArea>

          <Input
            defaultValue={website}
            onChange={this.changeWebsite}
            autoFocus={true}
          >
            Optional: Add your community???s website
          </Input>

          {photoSizeError && (
            <Notice style={{ marginTop: '16px' }}>
              Photo uploads should be less than 3mb
            </Notice>
          )}
        </Form>

        <Actions>
          <div />
          <Button
            loading={isLoading}
            onClick={this.save}
            disabled={photoSizeError}
          >
            {isLoading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </Actions>
      </FormContainer>
    );
  }
}

const Community = compose(
  deleteCommunityMutation,
  editCommunityMutation,
  withRouter,
  connect()
)(CommunityWithData);
export default Community;
