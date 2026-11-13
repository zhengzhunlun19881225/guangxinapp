import KnowledgePage,{SkillTree} from './KnowledgeSkills';
import ScheduledShares from './ScheduledShares';
import SharePage from './SharePage';
import Writing from './Writing';
import FileMedia from './FileMedia';
import IMSearch from './IMSearch';
import CreateGroup from './CreateGroup';
import type {FeatureProps} from './data';
export default function FeaturePages(props:FeatureProps&{ask:(text:string)=>void}){
 const {route}=props;
 if(route==='im-create-group')return <CreateGroup {...props}/>;
 if(route==='skill-tree')return <SkillTree {...props}/>;
 if(route==='scheduled-shares')return <ScheduledShares {...props}/>;
 if(route==='knowledge'||route==='knowledge-files')return <KnowledgePage {...props}/>;
 if(route==='writing'||route==='writing-document')return <Writing {...props}/>;
 if(route==='share')return <SharePage {...props}/>;
 if(route==='im-search-all'||route==='im-chat-search')return <IMSearch {...props}/>;
 return <FileMedia {...props}/>;
}
