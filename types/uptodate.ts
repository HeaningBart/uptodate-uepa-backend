export type UpToDateResponse = {
  data: {
    topicInfo: {
      isDrugLandingPage: boolean
      languageDisplayNames: {
        'en-US': string
      }
      translatedTopicInfos: any[]
      relatedGraphics: {
        imageKey: string
        title: string
        type: string
      }[]
      internationalBrandNames: any[]
      id: string
      type: string
      subtype: string
      version: string
      title: string
      languageCode: string
      languageCodes: string[]
      translatedTitles: {
        ja: string
      }
      hideInResults: boolean
    }
    outlineHtml: string
    bodyHtml: string
    viewOutlineText: string
    viewTopicText: string
    metaDescription: string
    showTopicFeedback: boolean
    isCanShare: boolean
    isCanBookmark: boolean
  }
  assetList: {
    assetKey: {
      assetType: string
      assetId: string
    }
    assetEncoding: string[]
    data: {
      cmeTicker: {
        credits: string
        name: string
        dateMs: number
      }
      cmeTrack: boolean
      inlineCmeEligible: boolean
    }
  }[]
}

export type GraphicInfo = {
  displayName: string
  languageDisplayNames: {
    [key: string]: string
  }
  imageKey: string
  id: string
  type: string
  subtype: string
  version: string
  title: string
  languageCode: string
  hideInResults: boolean
}

export type RelatedGraphic = {
  imageKey: string
  title: string
  type: string
}

export type UptoDateImageResponse = {
  data: {
    graphicInfo: GraphicInfo
    imageHtml: string
    relatedTopicSubTypes: string[]
    relatedGraphics: RelatedGraphic[]
    showGraphicFeedback: boolean
  }
  assetList: {
    assetKey: {
      assetType: string
      assetId: string
    }
    assetEncoding: string[]
    data: {
      cmeTicker: {
        credits: string
        name: string
        dateMs: number
      }
      cmeTrack: boolean
      inlineCmeEligible: boolean
    }
  }[]
}
